'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import { XCircle } from 'lucide-react';

// This component is for development purposes only
export const UserSwitcher = () => {
  const router = useRouter();
  const [showPanel, setShowPanel] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  
  // Mock test users with different roles
  const testUsers = [
    { email: 'admin@g.nagaoka.ac.jp', name: 'テスト管理者', role: 'ADMIN' },
    { email: 'student1@g.nagaoka.ac.jp', name: 'テスト学生1 (プロフィールあり)', role: 'USER' },
    { email: 'student2@g.nagaoka.ac.jp', name: 'テスト学生2 (プロフィールなし)', role: 'USER' },
    { email: 'teacher@g.nagaoka.ac.jp', name: 'テスト教員', role: 'USER' },
  ];

  const switchUser = async (email: string) => {
    await signOut({ redirect: false });
    await signIn('credentials', { 
      email, 
      password: 'testuser123', // For development purposes only
      redirect: false 
    });
    router.refresh();
    setShowPanel(false);
  };
  
  const loginWithCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    
    await signOut({ redirect: false });
    const result = await signIn('credentials', { 
      email: customEmail,
      name: customName || 'Custom User',
      password: 'testuser123',
      redirect: false 
    });
    
    // If there was an error, log it to console
    if (result?.error) {
      console.error('Login error:', result.error);
    } else {
      // Force a full page refresh to ensure the session is updated
      window.location.href = '/';
    }
    
    setShowPanel(false);
    setShowCustomForm(false);
    setCustomEmail('');
    setCustomName('');
  };

  // Only show in development environment
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setShowPanel(!showPanel)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center"
      >
        <span>開発モード: ユーザー切替</span>
      </button>

      {showPanel && (
        <div className="absolute bottom-14 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-yellow-600 dark:text-yellow-400">開発用: テストユーザー切替</h3>
            <button 
              onClick={() => setShowPanel(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <XCircle size={16} />
            </button>
          </div>
          
          {showCustomForm ? (
            <div className="mb-3">
              <form onSubmit={loginWithCustomEmail} className="space-y-2">
                <div>
                  <label className="block text-xs mb-1">Email (任意のメールアドレスを入力)</label>
                  <input 
                    type="email" 
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                    placeholder="test@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">表示名</label>
                  <input 
                    type="text" 
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                    placeholder="テストユーザー"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    className="flex-1 text-center p-2 text-xs bg-gray-200 dark:bg-gray-700 rounded"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="flex-1 text-center p-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ログイン
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {testUsers.map((user) => (
                  <button
                    key={user.email}
                    onClick={() => switchUser(user.email)}
                    className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex justify-between"
                  >
                    <span>{user.name}</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="mt-3 flex flex-col space-y-2">
                <button
                  onClick={() => setShowCustomForm(true)}
                  className="w-full text-center p-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded"
                >
                  カスタムユーザーでログイン
                </button>
                <button
                  onClick={() => signOut()}
                  className="w-full text-center p-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  ログアウト
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
