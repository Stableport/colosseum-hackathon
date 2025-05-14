
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AppLayout from '@/components/Layout/AppLayout';
import SenderDashboard from '@/components/Dashboard/SenderDashboard';
import RecipientDashboard from '@/components/Dashboard/RecipientDashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeView, setActiveView] = useState<'sender' | 'recipient'>('recipient');
  const isMobile = useIsMobile();

  return (
    <AppLayout>
      <div className={cn(
        "py-4",
        !isMobile && "bg-card rounded-lg border shadow-sm p-6"
      )}>
        <Tabs 
          defaultValue="recipient" 
          className="w-full" 
          onValueChange={(value) => setActiveView(value as 'sender' | 'recipient')}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <TabsList>
              <TabsTrigger value="sender">Sender View</TabsTrigger>
              <TabsTrigger value="recipient">Recipient View</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="sender">
            <SenderDashboard />
          </TabsContent>
          <TabsContent value="recipient">
            <RecipientDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Index;
