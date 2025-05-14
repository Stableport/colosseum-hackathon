
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, Clock, User, Settings, LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (isMobile) return null;

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Wallet, label: 'Transfers', path: '/send' },
    { icon: Clock, label: 'History', path: '/history' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const bottomNavItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: LogOut, label: 'Log Out', path: '/logout' },
  ];

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-sidebar-primary">Stableport</h1>
      </div>
      
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.label}>
                <Link 
                  to={item.path} 
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-primary font-medium" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon size={20} strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="px-3 py-4 border-t border-sidebar-border mt-auto">
        <ul className="space-y-1">
          {bottomNavItems.map(item => (
            <li key={item.label}>
              <Link 
                to={item.path} 
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
              >
                <item.icon size={20} strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
