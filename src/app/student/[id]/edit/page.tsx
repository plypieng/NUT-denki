import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { MainLayout } from '@/components/layouts/MainLayout';
import { StudentForm } from '@/components/forms/StudentForm';
import { prisma } from '@/lib/prisma-client';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 認証チェック
  const session = await getServerSession();
  if (!session) {
    redirect('/auth/signin');
  }

  // 管理者かどうかを確認
  const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;
  
  // 学生データの取得
  const student = await prisma.student.findUnique({
    where: { id },
  });

  // 学生が見つからない場合はNotFoundページへ
  if (!student) {
    notFound();
  }
  
  // 非管理者の場合、自分のプロフィールかどうかを確認
  if (!isAdmin && session.user?.email) {
    const emailUsername = session.user.email.split('@')[0];
    
    // ユーザーのメールアドレスの一部が学籍番号に含まれていない場合は権限なし
    if (!student.studentId.includes(emailUsername)) {
      redirect('/');
    }
    // 自分のプロフィールの場合は編集可能
  }

  // Dateオブジェクトを文字列に変換
  const formattedStudent = {
    ...student,
    birthDate: student.birthDate.toISOString().split('T')[0], // YYYY-MM-DD形式の文字列に変換
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <Link
          href={`/student/${id}`}
          className="flex items-center text-gray-600 hover:text-primary-nut-blue dark:text-gray-300 dark:hover:text-blue-400"
        >
          <ChevronLeft size={20} />
          <span>詳細に戻る</span>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">学生情報の編集</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          学生の情報を編集してください。* のついた項目は必須です。
        </p>
      </div>

      <StudentForm initialData={formattedStudent} isEditing />
    </MainLayout>
  );
}
