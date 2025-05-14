
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, BadgeCheck, Wallet, History, TrendingUp, User, UserCheck, Circle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import StatusBadge from '../common/StatusBadge';
import TransactionCard, { TransactionProps } from '../common/TransactionCard';

// Mock data for the recipient dashboard with updated years and larger amounts
const recentTransactions: TransactionProps[] = [
  {
    id: 'tx1',
    date: '24 Apr 2025, 2:30 PM',
    amount: '750,000',
    recipientName: 'From: Zenith Ventures Ltd',
    status: 'completed',
    sourceCurrency: 'NGN',
    targetCurrency: 'AED',
  },
  {
    id: 'tx2',
    date: '18 Apr 2025, 1:15 PM',
    amount: '1,250,000',
    recipientName: 'From: Accra Global Trading',
    status: 'completed',
    sourceCurrency: 'GHS',
    targetCurrency: 'AED',
  },
  {
    id: 'tx3',
    date: '10 Apr 2025, 9:30 AM',
    amount: '500,000',
    recipientName: 'From: Lagos Exports Inc.',
    status: 'completed',
    sourceCurrency: 'NGN',
    targetCurrency: 'AED',
  },
];

const RecipientDashboard = () => {
  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hello, Gulf Trading Solutions</h1>
          <p className="text-sm text-muted-foreground">Welcome to Stableport</p>
        </div>
        <Link to="/profile" className="block">
          <Avatar className="h-10 w-10 bg-primary/10">
            <AvatarFallback className="text-primary font-medium">GT</AvatarFallback>
          </Avatar>
        </Link>
      </div>
      
      {/* Profile Card with KYC Status */}
      <Card className="bg-background border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium flex items-center gap-2">
              <UserCheck size={18} className="text-primary" />
              Account Status
            </h3>
            <StatusBadge status="verified" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Lifetime Received</p>
                <p className="font-medium">AED 7,850,000</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="font-medium">AED 1,235,000</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/profile">View Profile</Link>
            </Button>
            <Button variant="outline" className="flex items-center gap-1" asChild>
              <Link to="/how-it-works">
                <Info size={16} />
                <span>How It Works</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Circle size={20} className="text-primary-foreground/80" fill="#2775CA" />
            <p className="text-primary-foreground/80">Via Stableport network</p>
          </div>
          <h2 className="text-3xl font-light mb-1">AED 750,000.00</h2>
          <p className="text-sm text-primary-foreground/80">From Zenith Ventures Ltd • 24 Apr, 2025</p>
          
          <div className="mt-6">
            <Button variant="secondary" className="w-full" asChild>
              <Link to="/transaction/tx1">View Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-lg border border-border p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Circle size={16} className="text-fintech-yellow" fill="#2775CA" />
          Incoming Payment Timeline
        </h3>
        
        <div className="space-y-4">
          <div className="transaction-step flex items-center">
            <div className="bg-fintech-green rounded-full p-1 z-10 mr-3">
              <div className="bg-white rounded-full w-4 h-4"></div>
            </div>
            <div>
              <h4 className="font-medium">USDC Received</h4>
              <p className="text-xs text-muted-foreground">24 Apr 2025, 2:30 PM</p>
            </div>
          </div>
          
          <div className="transaction-step flex items-center">
            <div className="bg-fintech-green rounded-full p-1 z-10 mr-3">
              <div className="bg-white rounded-full w-4 h-4"></div>
            </div>
            <div>
              <h4 className="font-medium">Converted to AED</h4>
              <p className="text-xs text-muted-foreground">24 Apr 2025, 2:35 PM</p>
            </div>
          </div>
          
          <div className="transaction-step flex items-center">
            <div className="bg-fintech-green rounded-full p-1 z-10 mr-3">
              <div className="bg-white rounded-full w-4 h-4"></div>
            </div>
            <div>
              <h4 className="font-medium">Settled to Bank</h4>
              <p className="text-xs text-muted-foreground">24 Apr 2025, 2:45 PM</p>
            </div>
          </div>
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

export default RecipientDashboard;
