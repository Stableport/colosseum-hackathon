import React, { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Send, ArrowDownLeft, Filter, ArrowDown } from 'lucide-react';
import TransactionCard, { TransactionProps } from '@/components/common/TransactionCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Mock data for the transactions
const sentTransactions: TransactionProps[] = [
  {
    id: 'tx4',
    date: '28 Apr, 3:45 PM',
    amount: '5,000',
    recipientName: 'To: Mohammed Ali',
    status: 'completed',
    sourceCurrency: 'NGN',
    targetCurrency: 'AED',
  },
  {
    id: 'tx5',
    date: '20 Apr, 11:30 AM',
    amount: '10,000',
    recipientName: 'To: Fatima Hassan',
    status: 'completed',
    sourceCurrency: 'GHS',
    targetCurrency: 'AED',
  },
  {
    id: 'tx6',
    date: '15 Apr, 2:15 PM',
    amount: '7,200',
    recipientName: 'To: Abdullah Rahman',
    status: 'in-progress',
    sourceCurrency: 'NGN',
    targetCurrency: 'AED',
  },
  {
    id: 'tx7',
    date: '10 Apr, 9:00 AM',
    amount: '3,500',
    recipientName: 'To: Sara Ahmed',
    status: 'completed',
    sourceCurrency: 'KES',
    targetCurrency: 'AED',
  },
];

const receivedTransactions: TransactionProps[] = [
  {
    id: 'tx1',
    date: '24 Apr, 2:30 PM',
    amount: '7,500',
    recipientName: 'From: Chioma Nwosu',
    status: 'completed',
    sourceCurrency: 'NGN',
    targetCurrency: 'AED',
  },
  {
    id: 'tx2',
    date: '18 Apr, 1:15 PM',
    amount: '12,500',
    recipientName: 'From: Kwame Adjei',
    status: 'completed',
    sourceCurrency: 'GHS',
    targetCurrency: 'AED',
  },
  {
    id: 'tx3',
    date: '10 Apr, 9:30 AM',
    amount: '5,000',
    recipientName: 'From: Oluwatobi Ade',
    status: 'completed',
    sourceCurrency: 'NGN',
    targetCurrency: 'AED',
  },
];

const History = () => {
  const [activeTab, setActiveTab] = useState<string>('received');
  const isMobile = useIsMobile();

  return (
    <AppLayout>
      <div className={cn(
        "py-6 space-y-6",
        !isMobile && "bg-card rounded-lg border shadow-sm p-6"
      )}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Transaction History</h1>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
        </div>

        <Tabs 
          defaultValue="received" 
          className="w-full" 
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className={cn(
            "mb-6",
            isMobile ? "w-full" : "w-auto"
          )}>
            <TabsTrigger value="received" className={cn(
              "flex items-center justify-center",
              isMobile ? "flex-1" : ""
            )}>
              <ArrowDown size={16} className="mr-2" /> Received
            </TabsTrigger>
            <TabsTrigger value="sent" className={cn(
              "flex items-center justify-center",
              isMobile ? "flex-1" : ""
            )}>
              <Send size={16} className="mr-2" /> Sent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Received Transactions</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>Last 30 days</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "mb-6",
                  isMobile ? "grid grid-cols-2 gap-4" : "flex gap-6"
                )}>
                  <div className="rounded-lg bg-primary/5 p-4 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Total Received</p>
                    <p className="text-xl font-semibold">AED 25,000</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                    <p className="text-xl font-semibold">{receivedTransactions.length}</p>
                  </div>
                </div>

                <div className={cn(
                  isMobile ? "space-y-3" : "grid grid-cols-2 gap-4"
                )}>
                  {receivedTransactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sent">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sent Transactions</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>Last 30 days</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "mb-6",
                  isMobile ? "grid grid-cols-2 gap-4" : "flex gap-6"
                )}>
                  <div className="rounded-lg bg-primary/5 p-4 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Total Sent</p>
                    <p className="text-xl font-semibold">AED 25,700</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4 flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                    <p className="text-xl font-semibold">{sentTransactions.length}</p>
                  </div>
                </div>

                <div className={cn(
                  isMobile ? "space-y-3" : "grid grid-cols-2 gap-4"
                )}>
                  {sentTransactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default History;
