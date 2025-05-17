import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { MainLayout } from '@/components/layouts/MainLayout';
import { StudentForm } from '@/components/forms/StudentForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma-client';

export default async function NewStudentPage() {
  // 認証チェック
  const session = await getServerSession();
  if (!session) {
    redirect('/auth/signin');
  }

  // ユーザーが既にプロフィールを持っているか確認
  const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;
  
  // 非管理者の場合、既にプロフィールが存在するかを確認
  if (!isAdmin && session.user?.email) {
    // メールアドレスからユーザー名を取得 (example@nagaoka.ac.jp -> example)
    const emailUsername = session.user.email.split('@')[0];
    
    // 学生の場合、学籍番号はメールアドレスの一部を含む
    const existingProfile = await prisma.student.findFirst({
      where: {
        studentId: { contains: emailUsername }
      }
    });
    
    // 既にプロフィールがあればメインページにリダイレクト
    if (existingProfile) {
      redirect('/');
    }
    // プロフィールがない場合はプロフィール作成を許可
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
