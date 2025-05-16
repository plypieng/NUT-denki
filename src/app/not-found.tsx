import Link from 'next/link';
import { MainLayout } from '@/components/layouts/MainLayout';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-6xl font-bold text-primary-nut-blue mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="btn-primary flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>トップページに戻る</span>
        </Link>
      </div>
    </MainLayout>
  );
}
