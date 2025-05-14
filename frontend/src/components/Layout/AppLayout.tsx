
import React from 'react';
import BottomNav from '../Navigation/BottomNav';
import Sidebar from '../Navigation/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const AppLayout = ({ children, showNav = true }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex">
      {showNav && <Sidebar />}
      
      <main className={cn(
        "flex-1 bg-background min-h-screen transition-all",
        isMobile ? "w-full px-4 pb-20" : "ml-64 p-8"
      )}>
        <div className={cn(
          "mx-auto",
          isMobile ? "max-w-md w-full" : "max-w-5xl w-full"
        )}>
          {children}
        </div>
      </main>
      
      {showNav && isMobile && <BottomNav />}
    </div>
  );
};

export default AppLayout;
