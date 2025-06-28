
import React from 'react';
import { AppHeader } from './AppHeader';
import { Toaster } from '@/components/ui/toaster';
import { SidebarNav } from './SidebarNav';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <AppHeader />
      
      <div className="flex-grow flex flex-col md:flex-row">
        {user && (
          <div className={`${isMobile ? 'w-full' : 'w-64'} bg-white dark:bg-slate-900 shadow-sm border-r border-slate-200 dark:border-slate-800`}>
            <SidebarNav />
          </div>
        )}
        
        <main className={`flex-grow ${!user ? 'container mx-auto' : ''} p-4 md:p-6 overflow-x-hidden`}>
          {children}
        </main>
      </div>
      
      <footer className="bg-white dark:bg-slate-900 py-4 border-t border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600 dark:text-slate-400">
          &copy; {new Date().getFullYear()} EduConnect. All rights reserved.
          <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            Transforming education through technology
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};
