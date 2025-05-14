
import React, { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, LogOut, Wallet, UserCheck, ShieldCheck } from 'lucide-react';
import TransactionCard, { TransactionProps } from '@/components/common/TransactionCard';
import StatusBadge from '@/components/common/StatusBadge';

// Mock transaction data for the profile
const recentTransactions: TransactionProps[] = [
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
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState<string>('profile');

  return (
    <AppLayout>
      <div className="py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <Avatar className="h-12 w-12 bg-primary/10">
            <AvatarFallback className="text-primary font-medium">AM</AvatarFallback>
          </Avatar>
        </div>

        <Tabs
          defaultValue="profile"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="w-full mb-6">
            <TabsTrigger value="profile" className="flex-1">
              <User size={16} className="mr-2" /> Profile
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">
              <Wallet size={16} className="mr-2" /> Activity
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              <Settings size={16} className="mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <User size={18} className="mr-2 text-primary" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Full Name</span>
                      <span className="font-medium">Ahmed Mohammed</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Email</span>
                      <span className="font-medium">ahmed.mohammed@example.com</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <span className="font-medium">+971 50 123 4567</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Country</span>
                      <span className="font-medium">United Arab Emirates</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <UserCheck size={18} className="mr-2 text-primary" />
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">KYC Status</span>
                    <StatusBadge status="verified" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="text-green-500 mt-1" size={18} />
                      <div>
                        <p className="font-medium">Identity Verified</p>
                        <p className="text-sm text-muted-foreground">Passport verification completed on Apr 12, 2023</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="text-green-500 mt-1" size={18} />
                      <div>
                        <p className="font-medium">Address Verified</p>
                        <p className="text-sm text-muted-foreground">Address verification completed on Apr 15, 2023</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Wallet size={18} className="mr-2 text-primary" />
                    Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="rounded-lg bg-primary/5 p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Received</p>
                      <p className="text-xl font-semibold">AED 78,500</p>
                    </div>
                    <div className="rounded-lg bg-primary/5 p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Sent</p>
                      <p className="text-xl font-semibold">AED 0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Notification Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SMS Notifications</span>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Security</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Change Password</span>
                      <Button variant="outline" size="sm">Update</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Two-Factor Authentication</span>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-destructive font-medium mb-2">Account Actions</h3>
                  <Button variant="destructive" className="flex items-center gap-2 w-full">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Profile;
