import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { MainLayout } from '@/components/layouts/MainLayout';
import { prisma } from '@/lib/prisma-client';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Edit, Trash2, MessageCircle, Instagram, Twitter } from 'lucide-react';
import { SpecialtyLabels, formatCourseWithDepartment } from '@/types/schema';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 認証チェック
  const session = await getServerSession();
  if (!session) {
    redirect('/auth/signin');
  }

  // 管理者かどうかを確認
  const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;
  
  // ユーザーのメールアドレスからユーザー名を取得
  const emailUsername = session.user?.email?.split('@')[0] || '';

  // 学生データの取得
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
  });

  // 学生が見つからない場合はNotFoundページへ
  if (!student) {
    notFound();
  }

  // 生年月日をフォーマット
  const formattedBirthDate = format(new Date(student.birthDate), 'yyyy年MM月dd日', {
    locale: ja,
  });

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-primary-nut-blue dark:text-gray-300 dark:hover:text-blue-400"
        >
          <ChevronLeft size={20} />
          <span>一覧に戻る</span>
        </Link>

        {/* 管理者または自分のプロフィールの編集と削除ボタンを表示 */}
        {(isAdmin || (student as any).ownerEmail === session.user?.email || 
          (!!(student as any).ownerEmail === false && student.studentId.includes(emailUsername))) && (
          <div className="flex gap-2">
            <Link
              href={`/student/${id}/edit`}
              className="btn-primary flex items-center gap-1"
            >
              <Edit size={16} />
              <span>編集</span>
            </Link>
            <Link
              href={`/student/${id}/delete`}
              className="btn-accent flex items-center gap-1"
            >
              <Trash2 size={16} />
              <span>削除</span>
            </Link>
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          {/* 学生プロフィール画像 */}
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative h-64 w-64 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              {student.imageUrl ? (
                <Image
                  src={student.imageUrl}
                  alt={student.fullName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-500 dark:text-gray-400">
                  写真なし
                </div>
              )}
            </div>
          </div>

          {/* 学生情報セクション */}
          <div className="w-full md:w-2/3">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">基本情報</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">氏名</h3>
                  <p className="text-xl font-medium">{student.fullName}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">学籍番号</h3>
                  <p>{student.studentId}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">メールアドレス</h3>
                  <p>{(student as any).ownerEmail || '未設定'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">生年月日</h3>
                  <p>{formattedBirthDate}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">星座</h3>
                  <p>{student.starSign || '未設定'}</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">出身</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">出身地</h3>
                  <p>{student.hometown}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">出身高校／高専</h3>
                  <p>{student.almaMater}</p>
                </div>
                {student.kosenDepartment && (
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">高専学科</h3>
                    <p>{student.kosenDepartment}</p>
                  </div>
                )}
                {student.kosenThesis && (
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">卒研テーマ</h3>
                    <p>{student.kosenThesis}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">大学での情報</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">学年</h3>
                  <p>{student.year}</p>
                </div>
                <div className="space-y-1 col-span-1 md:col-span-2">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">専攻・専門コース</h3>
                  <p className="text-lg font-medium">
                    {formatCourseWithDepartment(student.targetCourse, true, student.year)}
                  </p>
                </div>
                {student.goodSubjects && (
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">得意科目</h3>
                    <p>{student.goodSubjects}</p>
                  </div>
                )}
                {student.circle && (
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">サークル</h3>
                    <p>{student.circle}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">パーソナル</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.mbti && (
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">MBTI</h3>
                    <p>{student.mbti}</p>
                  </div>
                )}
                {student.hobby && (
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">趣味</h3>
                    <p>{student.hobby}</p>
                  </div>
                )}
                {student.likes && (
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">好き</h3>
                    <p>{student.likes}</p>
                  </div>
                )}
                {student.dislikes && (
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">嫌い</h3>
                    <p>{student.dislikes}</p>
                  </div>
                )}
                {student.lineUrl && (
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">LINE</h3>
                    <p className="flex items-center gap-2">
                      <MessageCircle size={16} className="text-green-500" />
                      <span>{student.lineUrl}</span>
                    </p>
                  </div>
                )}
                {student.instagramUrl && (
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Instagram</h3>
                    <p className="flex items-center gap-2">
                      <Instagram size={16} className="text-pink-500" />
                      <span>{student.instagramUrl}</span>
                    </p>
                  </div>
                )}
                {student.xUrl && (
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">X</h3>
                    <p className="flex items-center gap-2">
                      <Twitter size={16} className="text-blue-400" />
                      <span>{student.xUrl}</span>
                    </p>
                  </div>
                )}
              </div>
            </section>

            {student.etcNote && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">その他</h2>
                <div className="space-y-1">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">備考</h3>
                  <p className="whitespace-pre-line">{student.etcNote}</p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
