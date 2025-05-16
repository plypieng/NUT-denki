'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AlertTriangle } from 'lucide-react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('認証中にエラーが発生しました');

  useEffect(() => {
    const error = searchParams.get('error');
    
    if (error === 'AccessDenied') {
      setErrorMessage('アクセスが拒否されました。長岡技術科学大学のメールアドレス（@stn.nagaokaut.ac.jp）でのみログインできます。');
    } else if (error === 'Configuration') {
      setErrorMessage('サーバー設定エラーが発生しました。管理者にお問い合わせください。');
    } else if (error === 'OAuthSignin' || error === 'OAuthCallback' || error === 'OAuthAccountNotLinked') {
      setErrorMessage('認証プロバイダーとの通信中にエラーが発生しました。しばらく経ってから再度お試しください。');
    } else if (error === 'Callback') {
      setErrorMessage('認証コールバック中にエラーが発生しました。');
    } else if (error === 'Default') {
      setErrorMessage('認証中に不明なエラーが発生しました。');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="card max-w-md w-full py-8 px-6">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 text-accent-nut-red">
            <AlertTriangle size={48} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            認証エラー
          </h1>
          <div className="mb-4">
            <Image
              src="/logo-nut.png"
              alt="長岡技術科学大学"
              width={60}
              height={60}
              className="mx-auto"
            />
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-6">
          {errorMessage}
        </div>

        <div className="flex justify-center">
          <Link
            href="/auth/signin"
            className="btn-primary"
          >
            ログインページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
