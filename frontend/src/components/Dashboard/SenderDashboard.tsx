
import React from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecipientCard, { RecipientProps } from '../common/RecipientCard';
import TransactionCard, { TransactionProps } from '../common/TransactionCard';

// Mock data for the dashboard with larger amounts
const recentTransactions: TransactionProps[] = [
  {
    id: 'tx1',
    date: '24 Apr 2025, 2:30 PM',
    amount: '750,000',
    recipientName: 'Gulf Trading Solutions LLC',
    status: 'completed',
    sourceCurrency: 'NGN',
    targetCurrency: 'AED',
  },
  {
    id: 'tx2',
    date: '20 Apr 2025, 10:15 AM',
    amount: '1,200,000',
    recipientName: 'Burj Enterprise Partners',
    status: 'in-progress',
    sourceCurrency: 'NGN',
    targetCurrency: 'AED',
  },
  {
    id: 'tx3',
    date: '15 Apr 2025, 5:45 PM',
    amount: '500,000',
    recipientName: 'Dubai Logistics Co.',
    status: 'failed',
    sourceCurrency: 'NGN',
    targetCurrency: 'AED',
  },
];

const frequentRecipients: RecipientProps[] = [
  {
    id: 'rec1',
    name: 'Gulf Trading Solutions LLC',
    accountNumber: 'IBAN5678901234',
    bankName: 'Emirates NBD',
    type: 'business',
    lastTransferAmount: '₦750,000',
    lastTransferDate: '24 Apr',
    stableportId: 'SP6790234',
  },
  {
    id: 'rec2',
    name: 'Burj Enterprise Partners',
    accountNumber: 'IBAN9012345678',
    bankName: 'Dubai Islamic Bank',
    type: 'business',
    lastTransferAmount: '₦1,200,000',
    lastTransferDate: '20 Apr',
    stableportId: 'SP1234567',
  },
];

const SenderDashboard = () => {
  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hello, Zenith Ventures</h1>
          <p className="text-sm text-muted-foreground">Welcome back to Stableport</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-medium">ZV</span>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <p className="text-muted-foreground text-sm">Available Balance</p>
            <h2 className="text-3xl font-light">₦12,500,600</h2>
          </div>
          
          <Button className="w-full gap-2" size="lg" asChild>
            <Link to="/send">
              <Send size={18} /> 
              <span>Instruct Payment</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Quick Payment</h2>
          <Link to="/recipients" className="text-sm text-primary flex items-center gap-1">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {frequentRecipients.map(recipient => (
            <Link to={`/send?recipient=${recipient.id}`} key={recipient.id}>
              <RecipientCard recipient={recipient} />
            </Link>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Transfers</h2>
          <Link to="/history" className="text-sm text-primary flex items-center gap-1">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {recentTransactions.map(transaction => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SenderDashboard;
