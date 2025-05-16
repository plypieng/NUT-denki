import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { MainLayout } from '@/components/layouts/MainLayout';
import { StudentForm } from '@/components/forms/StudentForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function NewStudentPage() {
  // 認証チェック
  const session = await getServerSession();
  if (!session) {
    redirect('/auth/signin');
  }

  // 管理者かどうかを確認（管理者のみ新規作成可能）
  const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;
  if (!isAdmin) {
    redirect('/');
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-primary-nut-blue dark:text-gray-300 dark:hover:text-blue-400"
        >
          <ChevronLeft size={20} />
          <span>一覧に戻る</span>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">学生情報の新規登録</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          学生の情報を入力してください。* のついた項目は必須です。
        </p>
      </div>

      <StudentForm />
    </MainLayout>
  );
}
