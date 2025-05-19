'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserAgreementModal } from '@/components/modals/UserAgreementModal';

type ClientHomeActionsProps = {
  isAdmin: boolean;
  hasProfile: boolean;
};

export const ClientHomeActions = ({ isAdmin, hasProfile }: ClientHomeActionsProps) => {
  const [showAgreement, setShowAgreement] = useState(false);
  const router = useRouter();

  const handleCreateProfile = () => {
    if (isAdmin) {
      // Admin users don't need to accept the agreement
      router.push('/student/new');
    } else {
      // Show agreement for regular users
      setShowAgreement(true);
    }
  };

  const handleAcceptAgreement = () => {
    setShowAgreement(false);
    router.push('/student/new');
  };

  // Show different actions based on user status
  if (!isAdmin && !hasProfile) {
    // Regular user without profile - show only profile creation button
    return (
      <>
        <button
          onClick={handleCreateProfile}
          className="btn-accent flex items-center gap-1 shadow-sm"
        >
          <Plus size={18} />
          <span>プロフィール作成</span>
        </button>

        <UserAgreementModal
          isOpen={showAgreement}
          onClose={() => setShowAgreement(false)}
          onAccept={handleAcceptAgreement}
        />
      </>
    );
  }
  
  // For users with profiles or admins - show appropriate actions

  return (
    <div className="flex gap-3">
      {isAdmin && (
        <button
          onClick={handleCreateProfile}
          className="btn-accent flex items-center gap-1 shadow-sm"
        >
          <Plus size={18} />
          <span>新規作成</span>
        </button>
      )}
      
      <button
        onClick={() => router.push('/statistics')}
        className="btn-primary flex items-center gap-1 shadow-sm"
      >
        <BarChart3 size={18} />
        <span>統計ダッシュボード</span>
      </button>

      <UserAgreementModal
        isOpen={showAgreement}
        onClose={() => setShowAgreement(false)}
        onAccept={handleAcceptAgreement}
      />
    </div>
  );
};
