
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from '../common/StatusBadge';
import { Separator } from '@/components/ui/separator';

// Updated transaction type to include optional error property
type Transaction = {
  id: string;
  date: string;
  time: string;
  amount: string;
  fee: string;
  recipientName: string;
  recipientBank: string;
  recipientAccount: string;
  status: 'completed' | 'in-progress' | 'failed' | 'pending';
  sourceCurrency: string;
  targetCurrency: string;
  targetAmount: string;
  exchangeRate: string;
  timeline: Array<{
    stage: string;
    time: string;
    status: 'completed' | 'in-progress' | 'failed' | 'pending';
  }>;
  error?: string; // Added optional error property
};

// Mock transaction data
const transactions: Record<string, Transaction> = {
  tx1: {
    id: 'tx1',
    date: '24 Apr, 2023',
    time: '2:30 PM',
    amount: '75,000',
    fee: '750',
    recipientName: 'Ahmed Mohamed',
    recipientBank: 'Emirates NBD',
    recipientAccount: 'IBAN5678901234',
    status: 'completed',
    sourceCurrency: 'NGN',
    targetCurrency: 'AED',
    targetAmount: '2,500',
    exchangeRate: '0.033',
    timeline: [
      { stage: 'Payment Received', time: '2:30 PM', status: 'completed' },
      { stage: 'Processing', time: '2:35 PM', status: 'completed' },
      { stage: 'Funds Sent', time: '2:40 PM', status: 'completed' },
      { stage: 'Settled to Bank', time: '2:45 PM', status: 'completed' }
    ]
  },
  tx2: {
    id: 'tx2',
    date: '20 Apr, 2023',
    time: '10:15 AM',
    amount: '120,000',
    fee: '1,200',
    recipientName: 'Burj Solutions LLC',
    recipientBank: 'Dubai Islamic Bank',
    recipientAccount: 'IBAN9012345678',
    status: 'in-progress',
    sourceCurrency: 'NGN',
    targetCurrency: 'AED',
    targetAmount: '4,000',
    exchangeRate: '0.033',
    timeline: [
      { stage: 'Payment Received', time: '10:15 AM', status: 'completed' },
      { stage: 'Processing', time: '10:20 AM', status: 'completed' },
      { stage: 'Funds Sent', time: '10:25 AM', status: 'in-progress' },
      { stage: 'Settled to Bank', time: 'Pending', status: 'pending' }
    ]
  },
  tx3: {
    id: 'tx3',
    date: '15 Apr, 2023',
    time: '5:45 PM',
    amount: '50,000',
    fee: '500',
    recipientName: 'Sara Ali',
    recipientBank: 'Abu Dhabi Commercial Bank',
    recipientAccount: 'IBAN1234567890',
    status: 'failed',
    sourceCurrency: 'NGN',
    targetCurrency: 'AED',
    targetAmount: '1,650',
    exchangeRate: '0.033',
    timeline: [
      { stage: 'Payment Received', time: '5:45 PM', status: 'completed' },
      { stage: 'Processing', time: '5:50 PM', status: 'completed' },
      { stage: 'Funds Sent', time: '5:55 PM', status: 'failed' },
      { stage: 'Settled to Bank', time: 'Failed', status: 'failed' }
    ],
    error: 'Invalid recipient bank details. Please update and try again.'
  }
};

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const transaction = id ? transactions[id as keyof typeof transactions] : null;
  
  if (!transaction) {
    return (
      <div className="py-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">Transaction Not Found</h1>
        <p className="text-muted-foreground mb-6">The transaction you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <Link to="/" className="flex items-center text-muted-foreground mb-2">
        <ArrowLeft size={18} className="mr-1" />
        <span>Back to Dashboard</span>
      </Link>
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Transfer Details</h1>
        <StatusBadge status={transaction.status} />
      </div>
      
      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground mb-2">{transaction.date} • {transaction.time}</p>
            <div className="flex items-center gap-6 my-2">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">You sent</p>
                <p className="text-xl font-medium">
                  {transaction.sourceCurrency} {transaction.amount}
                </p>
              </div>
              <ArrowRight size={24} className="text-primary" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Recipient got</p>
                <p className="text-xl font-medium">
                  {transaction.targetCurrency} {transaction.targetAmount}
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="font-medium">Transfer Progress</h3>
            <div className="space-y-3">
              {transaction.timeline.map((stage, index) => (
                <div key={index} className="transaction-step">
                  <div className={`rounded-full p-1 z-10 mr-3 ${
                    stage.status === 'completed' 
                      ? 'bg-fintech-green' 
                      : stage.status === 'in-progress' 
                      ? 'bg-fintech-blue' 
                      : 'bg-muted'
                  }`}>
                    <div className="bg-white rounded-full w-4 h-4"></div>
                  </div>
                  <div>
                    <h4 className={`font-medium ${
                      stage.status === 'failed' ? 'text-fintech-red' : 
                      stage.status === 'pending' ? 'text-muted-foreground' : ''
                    }`}>{stage.stage}</h4>
                    <p className="text-xs text-muted-foreground">{stage.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {transaction.error && (
              <div className="bg-fintech-light-red text-fintech-red p-3 rounded text-sm">
                {transaction.error}
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t border-border">
            <h3 className="font-medium mb-3">Transfer Details</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transaction ID</span>
                <span className="text-sm">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Recipient</span>
                <span className="text-sm font-medium">{transaction.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bank</span>
                <span className="text-sm">{transaction.recipientBank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Account</span>
                <span className="text-sm">{transaction.recipientAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fee</span>
                <span className="text-sm">{transaction.sourceCurrency} {transaction.fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Exchange rate</span>
                <span className="text-sm">1 {transaction.sourceCurrency} = {transaction.exchangeRate} {transaction.targetCurrency}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Button variant="secondary" className="w-full gap-2">
        <MessageSquare size={18} />
        <span>Contact Support</span>
      </Button>
    </div>
  );
};

export default TransactionDetail;
