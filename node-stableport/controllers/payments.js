const { v4: uuid } = require('uuid');
const paymentModel = require('../models/payment');
const exchangeAdapter = require('../adapters/exchange');
const userModel = require('../models/user');

exports.getQuote = async (req, res, next) => {
  try {
    const { 
      recipientExchangeId, 
      recipientAccountId, 
      recipientAmount, 
      recipientCurrency 
    } = req.body;
    
    if (!recipientExchangeId || !recipientAccountId || !recipientAmount || !recipientCurrency) {
      return res.status(400).json({ 
        error: { 
          message: 'Missing required quote parameters', 
          code: 'INVALID_QUOTE_PARAMS' 
        } 
      });
    }
    
    // Get user's linked exchanges
    const user = await userModel.findById(req.user.id);
    const linkedExchanges = user.linkedExchanges;
    
    if (linkedExchanges.length === 0) {
      return res.status(400).json({ 
        error: { 
          message: 'No linked exchange partners found', 
          code: 'NO_LINKED_EXCHANGES' 
        } 
      });
    }
    
    // Get USDC required from recipient exchange
    const recipientQuote = await exchangeAdapter.getQuote(
      recipientExchangeId,
      {
        netFiatAmount: recipientAmount,
        currency: recipientCurrency,
        direction: 'buy' // USDC -> Fiat
      }
    );
    
    // Get quotes from all user's linked exchange partners
    const quotes = await Promise.all(
      linkedExchanges.map(async (exchange) => {
        try {
          const quote = await exchangeAdapter.getQuote(
            exchange.exchangeId,
            {
              usdcAmount: recipientQuote.usdcRequired,
              direction: 'sell' // Fiat -> USDC
            },
            exchange.oauthToken
          );
          
          return {
            exchangeId: exchange.exchangeId,
            exchangeName: exchange.exchangeName || exchange.exchangeId,
            fiatAmount: quote.fiatAmount,
            fiatCurrency: quote.fiatCurrency,
            fee: quote.fee
          };
        } catch (error) {
          console.error(`Error getting quote from ${exchange.exchangeId}:`, error);
          return null;
        }
      })
    );
    
    // Filter out failed quotes
    const validQuotes = quotes.filter(q => q !== null);
    
    if (validQuotes.length === 0) {
      return res.status(400).json({ 
        error: { 
          message: 'Unable to get quotes from any linked exchange', 
          code: 'NO_VALID_QUOTES' 
        } 
      });
    }
    
    res.status(200).json({
      recipientDetails: {
        amount: recipientAmount,
        currency: recipientCurrency,
        exchangeId: recipientExchangeId,
        accountId: recipientAccountId
      },
      quotes: validQuotes,
      usdcAmount: recipientQuote.usdcRequired
    });
  } catch (error) {
    next(error);
  }
};

exports.initiatePayment = async (req, res, next) => {
  try {
    const {
      recipientExchangeId,
      recipientAccountId,
      recipientAmount,
      recipientCurrency,
      senderExchangeId,
      quoteId
    } = req.body;
    
    // Validate required parameters
    if (!recipientExchangeId || !recipientAccountId || !recipientAmount || 
        !recipientCurrency || !senderExchangeId) {
      return res.status(400).json({
        error: {
          message: 'Missing required payment parameters',
          code: 'INVALID_PAYMENT_PARAMS'
        }
      });
    }
    
    // Generate transaction ID
    const transactionId = uuid();
    
    // Get user and exchange token
    const user = await userModel.findById(req.user.id);
    const senderExchange = user.linkedExchanges.find(e => e.exchangeId === senderExchangeId);
    
    if (!senderExchange) {
      return res.status(400).json({
        error: {
          message: 'Selected sender exchange not linked to account',
          code: 'EXCHANGE_NOT_LINKED'
        }
      });
    }
    
    // Create transaction record
    const transaction = await paymentModel.create({
      id: transactionId,
      userId: user.id,
      senderExchangeId,
      recipientExchangeId,
      recipientAccountId,
      recipientAmount,
      recipientCurrency,
      status: 'initiated',
      createdAt: new Date()
    });
    
    // Initiate transaction with sender's exchange
    const paymentResult = await exchangeAdapter.initiateTransaction(
      senderExchangeId,
      {
        transactionId,
        recipientExchangeId,
        recipientAccountId,
        recipientAmount,
        recipientCurrency,
        quoteId
      },
      senderExchange.oauthToken
    );
    
    // Update transaction with response data
    await paymentModel.update(transactionId, {
      senderAmount: paymentResult.senderAmount,
      senderCurrency: paymentResult.senderCurrency,
      usdcAmount: paymentResult.usdcAmount,
      externalId: paymentResult.externalId,
      status: paymentResult.status || 'processing'
    });
    
    res.status(200).json({
      transactionId,
      status: paymentResult.status || 'processing',
      senderDetails: {
        amount: paymentResult.senderAmount,
        currency: paymentResult.senderCurrency,
        exchangeId: senderExchangeId
      },
      recipientDetails: {
        amount: recipientAmount,
        currency: recipientCurrency,
        exchangeId: recipientExchangeId,
        accountId: recipientAccountId
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransactionStatus = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    
    // Get transaction
    const transaction = await paymentModel.findById(transactionId);
    
    if (!transaction) {
      return res.status(404).json({
        error: {
          message: 'Transaction not found',
          code: 'TRANSACTION_NOT_FOUND'
        }
      });
    }
    
    // Verify transaction belongs to user
    if (transaction.userId !== req.user.id) {
      return res.status(403).json({
        error: {
          message: 'Access denied',
          code: 'ACCESS_DENIED'
        }
      });
    }
    
    // If transaction is still in progress, check status with exchange
    if (['initiated', 'processing'].includes(transaction.status)) {
      const user = await userModel.findById(req.user.id);
      const exchange = user.linkedExchanges.find(e => e.exchangeId === transaction.senderExchangeId);
      
      if (exchange) {
        try {
          const statusResult = await exchangeAdapter.getTransactionStatus(
            transaction.senderExchangeId,
            transaction.externalId,
            exchange.oauthToken
          );
          
          if (statusResult.status !== transaction.status) {
            // Update transaction status
            await paymentModel.update(transactionId, { status: statusResult.status });
            transaction.status = statusResult.status;
          }
        } catch (error) {
          console.error('Error fetching transaction status from exchange:', error);
          // Don't fail the request, return the last known status
        }
      }
    }
    
    res.status(200).json({
      transactionId: transaction.id,
      status: transaction.status,
      senderDetails: {
        amount: transaction.senderAmount,
        currency: transaction.senderCurrency,
        exchangeId: transaction.senderExchangeId
      },
      recipientDetails: {
        amount: transaction.recipientAmount,
        currency: transaction.recipientCurrency,
        exchangeId: transaction.recipientExchangeId,
        accountId: transaction.recipientAccountId
      },
      usdcAmount: transaction.usdcAmount,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransactionHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // Get transactions for user
    const transactions = await paymentModel.findByUserId(
      req.user.id,
      {
        page: parseInt(page),
        limit: parseInt(limit),
        status
      }
    );
    
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

exports.exportTransactions = async (req, res, next) => {
  try {
    const { format = 'csv', dateFrom, dateTo } = req.query;
    
    // Get all transactions for the user within date range
    const transactions = await paymentModel.findByUserId(
      req.user.id,
      {
        dateFrom: dateFrom ? new Date(dateFrom) : undefined,
        dateTo: dateTo ? new Date(dateTo) : undefined,
        limit: 1000 // Reasonable limit for exports
      }
    );
    
    if (format.toLowerCase() === 'csv') {
      // Generate CSV
      const csv = generateCSV(transactions.data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="transactions-${Date.now()}.csv"`);
      res.status(200).send(csv);
    } else if (format.toLowerCase() === 'pdf') {
      // Generate PDF (mock)
      res.status(501).json({ error: { message: 'PDF export not yet implemented', code: 'NOT_IMPLEMENTED' } });
    } else {
      res.status(400).json({ error: { message: 'Unsupported format', code: 'INVALID_FORMAT' } });
    }
  } catch (error) {
    next(error);
  }
};

// Helper function to generate CSV
function generateCSV(transactions) {
  const header = 'Transaction ID,Date,Sender Exchange,Recipient Exchange,Sender Amount,Sender Currency,Recipient Amount,Recipient Currency,Status\n';
  
  const rows = transactions.map(t => {
    return `${t.id},${t.createdAt},${t.senderExchangeId},${t.recipientExchangeId},${t.senderAmount},${t.senderCurrency},${t.recipientAmount},${t.recipientCurrency},${t.status}`;
  }).join('\n');
  
  return header + rows;
}