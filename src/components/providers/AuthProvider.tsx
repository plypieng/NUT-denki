'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';
import { WhatsNewModal } from '@/components/ui/WhatsNewModal';

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProviderContent = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [isNewLogin, setIsNewLogin] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Check if this is a new login session
      const lastSessionTime = localStorage.getItem('lastSessionTime');
      const now = Date.now();
      const sessionTimeout = 30 * 60 * 1000; // 30 minutes

      if (!lastSessionTime || (now - parseInt(lastSessionTime)) > sessionTimeout) {
        setIsNewLogin(true);
        localStorage.setItem('lastSessionTime', now.toString());
      }
    }
  }, [status, session]);

  useEffect(() => {
    if (isNewLogin && status === 'authenticated') {
      // Check if there are unseen updates
      const seenUpdates = localStorage.getItem('seenUpdates') || '[]';
      const updates = [
        { id: 'phase2-2025-10', title: '検索機能の大幅改善', date: '2025年10月' },
        { id: 'phase1-2025-09', title: 'プライバシー強化とパフォーマンス改善', date: '2025年9月' },
      ];
      const unseen = updates.filter(update => !JSON.parse(seenUpdates).includes(update.id));
      
      if (unseen.length > 0) {
        setShowWhatsNew(true);
      }
      setIsNewLogin(false);
    }
  }, [isNewLogin, status]);

  const handleCloseWhatsNew = () => {
    setShowWhatsNew(false);
  };

  const handleDismissWhatsNew = () => {
    setShowWhatsNew(false);
    // The modal handles marking as seen
  };

  return (
    <>
      <SessionProvider>
        {children}
      </SessionProvider>
      <WhatsNewModal
        isOpen={showWhatsNew}
        onClose={handleCloseWhatsNew}
        onDismiss={handleDismissWhatsNew}
      />
    </>
  );
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <AuthProviderContent>{children}</AuthProviderContent>;
};
