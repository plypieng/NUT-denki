'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MainLayout } from '@/components/layouts/MainLayout';
import Link from 'next/link';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteStudentPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { data: session, status } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  // State to store student data
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Fetch student data and check authorization
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.replace('/auth/signin');
      return;
    }

    const fetchStudentAndCheckAuth = async () => {
      try {
        const response = await fetch(`/api/students/${id}`);
        if (!response.ok) {
          throw new Error('学生情報の取得に失敗しました');
        }
        
        const studentData = await response.json();
        setStudent(studentData);
        
        // Check if user is authorized (admin or profile owner)
        const isAdmin = session.user?.isAdmin;
        let isOwner = false;
        
        if (session.user?.email && studentData.studentId) {
          const emailUsername = session.user.email.split('@')[0];
          isOwner = studentData.studentId.includes(emailUsername);
        }
        
        setAuthorized(isAdmin || isOwner);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student:', error);
        toast.error('学生情報の取得に失敗しました');
        router.replace('/');
      }
    };

    fetchStudentAndCheckAuth();
  }, [id, session, status, router]);

  // During loading or unauthorized, render loading or error
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-nut-blue"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!authorized) {
    return (
      <MainLayout>
        <div className="text-center p-8">
          <AlertTriangle className="mx-auto text-red-500" size={48} />
          <h1 className="text-2xl font-bold mt-4">権限がありません</h1>
          <p className="mt-2">このプロフィールを削除する権限がありません。</p>
          <Link href="/" className="btn-primary mt-4 inline-block">ホームに戻る</Link>
        </div>
      </MainLayout>
    );
  }

  // 削除処理
  const handleDelete = async () => {
    setIsDeleting(true);
    console.log('Attempting to delete student:', id);
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      console.log('DELETE status:', response.status);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || '削除に失敗しました');
      }
      console.log('DELETE succeeded:', result);
      toast.success('学生情報を削除しました');
      router.replace('/');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || '削除に失敗しました');
      setIsDeleting(false);
    }
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

      <div className="card max-w-2xl mx-auto p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <AlertTriangle size={48} className="text-accent-nut-red mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            学生情報の削除確認
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            この操作は取り消せません。本当にこの学生の情報を削除しますか？
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href={`/student/${id}`}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            キャンセル
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-accent"
          >
            {isDeleting ? '削除中...' : '削除する'}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
