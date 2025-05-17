import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { MainLayout } from '@/components/layouts/MainLayout';
import { SearchFilters } from '@/components/students/SearchFilters';
import { StudentsGrid } from '@/components/students/StudentsGrid';
import { Pagination } from '@/components/ui/Pagination';
import { prisma } from '@/lib/prisma-client';
import { ClientHomeActions } from '@/components/home/ClientHomeActions';

type SearchParams = {
  q?: string;
  course?: string;
  circle?: string;
  page?: string;
  limit?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // 認証チェック
  const session = await getServerSession();
  if (!session) {
    redirect('/auth/signin');
  }

  // 動的 searchParams API を解決して検索・フィルターパラメータを取得
  const params = await searchParams;
  const query = params.q || '';
  const course = params.course || '';
  const circle = params.circle || '';
  const page = parseInt(params.page || '1');
  const limit = parseInt(params.limit || '50');
  const skip = (page - 1) * limit;

  // 管理者かどうかを確認
  const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;
  
  // ユーザーのメールアドレスからユーザー名を取得
  const emailUsername = session.user?.email?.split('@')[0] || '';
  
  // ユーザーが既にプロフィールを持っているかチェック
  let hasProfile = false;
  if (!isAdmin && emailUsername) {
    const existingProfile = await prisma.student.findFirst({
      where: {
        studentId: { contains: emailUsername }
      }
    });
    hasProfile = !!existingProfile;
  }

  // フィルター条件を構築
  const filter: any = {};

  if (course) {
    // 専攜分野でのフィルタリングチェック (department:XXXX 形式)
    if (course.startsWith('department:')) {
      const department = course.split(':')[1];
      filter.OR = [
        { targetCourse: 'DENKI_ENERGY_CONTROL' },
        { targetCourse: 'DENSHI_DEVICE_OPTICAL' },
        { targetCourse: 'JOHO_COMMUNICATION' },
        { targetCourse: '電気電子情報工学コース' },
      ];
    } else {
      // 通常のコースフィルタリング
      filter.targetCourse = course;
    }
  }

  if (circle) {
    filter.circle = {
      contains: circle,
    };
  }

  if (query) {
    filter.OR = [
      { fullName: { contains: query } },
      { studentId: { contains: query } },
      { hometown: { contains: query } },
      { almaMater: { contains: query } },
      { hobby: { contains: query } },
    ];
  }

  // データベースクエリの実行
  let students = [];
  let total = 0;
  try {
    [students, total] = await Promise.all([
      prisma.student.findMany({
        where: filter,
        orderBy: { fullName: 'asc' },
        skip,
        take: limit,
        select: {
          id: true,
          studentId: true,
          fullName: true,
          imageUrl: true,
          targetCourse: true,
          circle: true,
          year: true,
        },
      }),
      prisma.student.count({ where: filter }),
    ]);
  } catch (error: any) {
    console.error('Database connection error:', error);
    return (
      <MainLayout>
        <p className="text-center text-red-500 mt-8">
          データベース接続エラー: 学生データを取得できませんでした。
        </p>
      </MainLayout>
    );
  }

  // 総ページ数を計算
  const totalPages = Math.ceil(total / limit);

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">学生一覧</h1>
        
        {/* 管理者またはプロフィールを持たないユーザーに新規作成ボタンを表示 */}
        <ClientHomeActions isAdmin={isAdmin} hasProfile={hasProfile} />
      </div>

      <SearchFilters />

      <div className="relative">
        <Suspense fallback={<p>読み込み中...</p>}>
          <StudentsGrid students={students} />
        </Suspense>

        <Pagination totalPages={totalPages} currentPage={page} />
      </div>
    </MainLayout>
  );
}
