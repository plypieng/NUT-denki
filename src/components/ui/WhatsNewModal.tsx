'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface UpdateItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: () => void;
}

const UPDATES: UpdateItem[] = [
  {
    id: 'phase2-2025-10',
    title: '検索機能の大幅改善',
    description: `
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>検索候補の自動表示（最近の検索・人気検索）</li>
        <li>検索履歴の保存と再利用</li>
        <li>より速い検索レスポンス</li>
        <li>画像の読み込み速度向上と品質改善</li>
        <li>読み込み中のスケルトン表示でスムーズな操作感</li>
      </ul>
    `,
    date: '2025年10月'
  },
  // Add more updates here as needed
  {
    id: 'phase1-2025-09',
    title: 'プライバシー強化とパフォーマンス改善',
    description: `
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>プロフィール画像の検索エンジンインデックス防止</li>
        <li>未認証ユーザー向け画像ぼかし表示</li>
        <li>APIレート制限によるセキュリティ強化</li>
        <li>エラーハンドリングの改善</li>
      </ul>
    `,
    date: '2025年9月'
  }
];

const getSeenUpdates = (): string[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('seenUpdates') || '[]');
};

const setSeenUpdate = (updateId: string) => {
  if (typeof window === 'undefined') return;
  const seen = getSeenUpdates();
  if (!seen.includes(updateId)) {
    seen.push(updateId);
    localStorage.setItem('seenUpdates', JSON.stringify(seen));
  }
};

export const WhatsNewModal = ({ isOpen, onClose, onDismiss }: WhatsNewModalProps) => {
  const [currentUpdate, setCurrentUpdate] = useState<UpdateItem | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const seen = getSeenUpdates();
    const unseenUpdates = UPDATES.filter(update => !seen.includes(update.id));
    
    if (unseenUpdates.length > 0) {
      setCurrentUpdate(unseenUpdates[0]); // Show the newest unseen update
    } else {
      onClose();
    }
  }, [isOpen, onClose]);

  if (!isOpen || !currentUpdate) return null;

  const handleDismiss = () => {
    setSeenUpdate(currentUpdate.id);
    onDismiss();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">新着情報</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentUpdate.date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {currentUpdate.title}
          </h3>
          <div 
            className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: currentUpdate.description }}
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            後で読む
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Check size={16} />
            了解しました（今後表示しない）
          </button>
        </div>
      </div>
    </div>
  );
};