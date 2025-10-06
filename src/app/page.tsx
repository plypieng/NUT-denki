import { Suspense } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { StudentsGrid } from '@/components/students/StudentsGrid';
import { ClientHomeActions } from '@/components/home/ClientHomeActions';
import { SearchFilters } from '@/components/students/SearchFilters';
import { SortingOptions } from '@/components/students/SortingOptions';
import { Pagination } from '@/components/ui/Pagination';
import { StudentsGridSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { prisma } from '@/lib/prisma-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Info } from 'lucide-react';


export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await the searchParams promise
  const resolvedParams = await searchParams;
  // 認証チェック - ログインしているかどうかのみチェック（リダイレクトしない）
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;
  const userEmail = session?.user?.email || '';
  const isAdmin = userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  
  // Check if the logged-in user already has a profile
  let hasProfile = false;
  if (userEmail) {
    const existingProfile = await prisma.student.findFirst({
      where: { ownerEmail: userEmail } as any,
    });
    hasProfile = !!existingProfile;
  }

  // 検索・フィルターパラメータを取得
  const query = resolvedParams.q?.toString() || '';
  const course = resolvedParams.course?.toString() || '';
  const circle = resolvedParams.circle?.toString() || '';
  const year = resolvedParams.year?.toString() || '';
  const page = parseInt(resolvedParams.page?.toString() || '1');
  const limit = parseInt(resolvedParams.limit?.toString() || '50');
  const skip = (page - 1) * limit;
  const sort = resolvedParams.sort?.toString() || 'fullName:asc';
  const [sortField, sortDirection] = sort.split(':');

  // フィルター条件を構築
  const filter: any = {};

  if (course) {
    // 専摂分野でのフィルタリングチェック (department:XXXX 形式)
    if (typeof course === 'string' && course.startsWith('department:')) {
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

  if (circle && typeof circle === 'string') {
    filter.circle = {
      contains: circle,
    };
  }
  
  if (year && typeof year === 'string') {
    filter.year = year;
  }

  if (query && typeof query === 'string') {
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
  let favorites = [];
  try {
    // Get user's favorites if logged in
    if (isAuthenticated && userEmail) {
      // Using 'as any' to bypass TS error until Prisma types are fully updated
      favorites = await (prisma as any).userFavorite.findMany({
        where: { userEmail },
        select: { studentId: true },
      });
    }

    // Build orderBy object based on sort params
    let orderBy: any = {};

    // Valid sortable fields (prevent SQL injection)
    const validSortFields = ['fullName', 'studentId', 'birthDate', 'createdAt'];
    const actualSortField = validSortFields.includes(sortField) ? sortField : 'fullName';
    const actualSortDir = sortDirection === 'desc' ? 'desc' : 'asc';

    // First order by pinned status, then by the selected field
    orderBy = [
      { isPinned: 'desc' },
      { [actualSortField]: actualSortDir },
    ];

    [students, total] = await Promise.all([
      prisma.student.findMany({
        where: filter,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          studentId: true,
          fullName: true,
          nickname: true,
          imageUrl: true,
          targetCourse: true,
          circle: true,
          year: true,
          isPinned: true,
          ownerEmail: true,
          caption: true,
          bloodType: true,
          // Cast to any to include new fields without TypeScript errors
        } as any,
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

        {/* Only show add button to authenticated users who are admin or don't have a profile */}
        {isAuthenticated && (
          <ClientHomeActions isAdmin={isAdmin} hasProfile={hasProfile} />
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Disable filtering for unauthenticated users */}
        <div className={!isAuthenticated ? 'pointer-events-none opacity-70' : ''}>
          <SearchFilters />
        </div>
        <div className={!isAuthenticated ? 'pointer-events-none opacity-70' : ''}>
          <SortingOptions />
        </div>
      </div>

      {/* Notice for unauthenticated users */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200 p-4 rounded-md mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium">ログインして完全な機能をご利用ください</h3>
              <p className="text-sm mt-1">学生プロフィールの詳細閲覧やお気に入り追加などの機能をご利用いただくには、ログインが必要です。</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <ErrorBoundary>
          <Suspense fallback={<StudentsGridSkeleton />}>
            <div className="relative">
              {/* Main content (student grid) */}
              <StudentsGrid
                students={students.map((student: any) => {
                  // Check if this student is favorited by current user
                  const isFavorited = isAuthenticated && favorites.some((fav: any) => fav.studentId === student.id);

                  return {
                    ...student,
                    isFavorited,
                    isAuthenticated
                  };
                })}
              />
            </div>
          </Suspense>
        </ErrorBoundary>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination 
              currentPage={page} 
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
