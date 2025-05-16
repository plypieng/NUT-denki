'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Sun, Moon, LogOut, LogIn } from 'lucide-react';

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary-nut-blue dark:bg-primary-nut-blue-dark text-white header-shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* 長岡技科大ロゴ */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">学生名鑑</span>
            <span className="text-sm ml-2">長岡技術科学大学</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* テーマ切り替えボタン */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 focus-ring"
            aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* ログインステータス/ボタン */}
          {session ? (
            <div className="flex items-center">
              <span className="mr-2 hidden sm:inline-block">{session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="p-2 rounded-full hover:bg-white/10 focus-ring flex items-center"
                aria-label="ログアウト"
              >
                <LogOut size={20} />
                <span className="ml-1 hidden sm:inline-block">ログアウト</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="p-2 rounded-full hover:bg-white/10 focus-ring flex items-center"
              aria-label="ログイン"
            >
              <LogIn size={20} />
              <span className="ml-1 hidden sm:inline-block">ログイン</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
