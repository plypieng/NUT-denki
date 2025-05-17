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
  // Add a global style to ensure scrollbar is always visible
  return (
    <>
      <style jsx global>{`
        html, body {
          overflow-y: auto !important;
          height: auto !important;
        }
      `}</style>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 overflow-y-auto">
          {children}
        </main>
        <Toaster position="top-right" richColors />
        <Footer />
        <UserSwitcher />
      </div>
    </>
  );
};
