'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignInPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState<string>('/');

  // ログイン後またはエラー処理
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    if (errorParam === 'AccessDenied') {
      setError('長岡技術科学大学のメールアドレス（@stn.nagaokaut.ac.jp）でのみログインできます');
    } else if (errorParam) {
      setError('ログインに失敗しました');
    }
    setCallbackUrl(params.get('callbackUrl') || '/');
  }, []);

  // 認証後リダイレクト
  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, callbackUrl, router]);

  // Googleでログイン
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn('google', { callbackUrl });
    } catch (err) {
      setError('ログインに失敗しました');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="card max-w-md w-full py-8 px-6">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <Image
              src="/logo-nut.png"
              alt="長岡技術科学大学"
              width={80}
              height={80}
              className="mx-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            学生名鑑アプリ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            長岡技術科学大学 電気電子情報工学専攻
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            長岡技術科学大学のメールアドレス（@stn.nagaokaut.ac.jp）でログインしてください
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus-ring"
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
            />
            <span>{isLoading ? 'ログイン中...' : 'Googleでログイン'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
