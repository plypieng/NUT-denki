'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { UserAgreementModal } from '../modals/UserAgreementModal';
import { useRouter } from 'next/navigation';

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

  // Don't show anything if the user is not admin and already has a profile
  if (!isAdmin && hasProfile) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleCreateProfile}
        className="btn-accent flex items-center gap-1 shadow-sm"
      >
        <Plus size={18} />
        <span>{isAdmin ? '新規作成' : 'プロフィール作成'}</span>
      </button>

      <UserAgreementModal
        isOpen={showAgreement}
        onClose={() => setShowAgreement(false)}
        onAccept={handleAcceptAgreement}
      />
    </>
  );
};
