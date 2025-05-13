// Mock database for transactions
let transactions = {};

exports.create = async (transactionData) => {
  const transaction = {
    ...transactionData,
    updatedAt: new Date()
  };
  
  transactions[transactionData.id] = transaction;
  return transaction;
};

exports.findById = async (transactionId) => {
  return transactions[transactionId] || null;
};

exports.update = async (transactionId, updateData) => {
  if (!transactions[transactionId]) {
    throw new Error('Transaction not found');
  }
  
  const updatedTransaction = {
    ...transactions[transactionId],
    ...updateData,
    updatedAt: new Date()
  };
  
  transactions[transactionId] = updatedTransaction;
  return updatedTransaction;
};

exports.findByUserId = async (userId, options = {}) => {
  const { page = 1, limit = 10, status, dateFrom, dateTo } = options;
  
  let filteredTransactions = Object.values(transactions).filter(t => t.userId === userId);
  
  // Apply filters
  if (status) {
    filteredTransactions = filteredTransactions.filter(t => t.status === status);
  }
  
  if (dateFrom) {
    filteredTransactions = filteredTransactions.filter(t => new Date(t.createdAt) >= dateFrom);
  }
  
  if (dateTo) {
    filteredTransactions = filteredTransactions.filter(t => new Date(t.createdAt) <= dateTo);
  }
  
  // Sort by date descending
  filteredTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Paginate
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedTransactions = filteredTransactions.slice(start, end);
  
  return {
    data: paginatedTransactions,
    pagination: {
      total: filteredTransactions.length,
      page,
      limit,
      pages: Math.ceil(filteredTransactions.length / limit)
    }
  };
};
