'use client';

import { ReactNode } from 'react';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { Toaster } from 'sonner';
import { UserSwitcher } from '@/components/development/UserSwitcher';

type MainLayoutProps = {
  children: ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster position="top-right" richColors />
      <Footer />
      <UserSwitcher />
    </div>
  );
};
