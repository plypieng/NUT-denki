'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { SpecialtyType } from '@/types/schema';
import { StudentCard } from './StudentCard';

type Student = {
  id: string;
  fullName: string;
  studentId: string;
  imageUrl?: string | null;
  targetCourse: SpecialtyType;
  circle?: string | null;
  caption?: string | null;
  year?: string;
  isFavorited?: boolean;
  isAuthenticated?: boolean;
};

type StudentsGridProps = {
  initialStudents: Student[];
  searchQuery?: string;
  courseFilter?: string;
  circleFilter?: string;
  sortBy?: string;
};

type ApiResponse = {
  students: Student[];
  pagination: {
    hasMore: boolean;
    nextOffset: number;
    limit: number;
  };
};

const ITEMS_PER_LOAD_DESKTOP = 12;
const ITEMS_PER_LOAD_MOBILE = 6;

export const StudentsGrid = ({
  initialStudents,
  searchQuery = '',
  courseFilter = '',
  circleFilter = '',
  sortBy = 'fullName:asc'
}: StudentsGridProps) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextOffset, setNextOffset] = useState<number>(initialStudents.length);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());
  const observerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Check authentication status and fetch favorites
  useEffect(() => {
    const checkAuthAndFetchFavorites = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        const authenticated = !!session?.user;
        setIsAuthenticated(authenticated);

        if (authenticated) {
          // Fetch user's favorites
          try {
            const favResponse = await fetch('/api/user/favorites');
            if (favResponse.ok) {
              const favorites = await favResponse.json();
              setUserFavorites(new Set(favorites.map((fav: any) => fav.studentId)));
            }
          } catch (error) {
            console.error('Failed to fetch favorites:', error);
          }
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuthAndFetchFavorites();
  }, []);

  // Reset state when filters change
  useEffect(() => {
    setStudents(initialStudents);
    setHasMore(true);
    setNextOffset(initialStudents.length);
    setError(null);
  }, [initialStudents, searchQuery, courseFilter, circleFilter]);

  const loadMoreStudents = useCallback(async () => {
    if (loadingRef.current || !hasMore || !isAuthenticated) return;

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const itemsPerLoad = isMobile ? ITEMS_PER_LOAD_MOBILE : ITEMS_PER_LOAD_DESKTOP;
      const params = new URLSearchParams({
        limit: itemsPerLoad.toString(),
        sort: sortBy,
        offset: nextOffset.toString(),
        ...(searchQuery && { q: searchQuery }),
        ...(courseFilter && { course: courseFilter }),
        ...(circleFilter && { circle: circleFilter }),
      });

      const response = await fetch(`/api/students?${params}`);
      if (!response.ok) {
        if (response.status === 401) {
          // User is not authenticated, disable infinite scroll
          setHasMore(false);
          return;
        }
        throw new Error('Failed to load students');
      }

      const data: ApiResponse = await response.json();

      // Add favorite status to newly loaded students
      const studentsWithFavorites = data.students.map(student => ({
        ...student,
        isFavorited: userFavorites.has(student.id),
        isAuthenticated,
      }));

      setStudents(prev => [...prev, ...studentsWithFavorites]);
      setHasMore(data.pagination.hasMore);
      setNextOffset(data.pagination.nextOffset);
    } catch (err) {
      setError('学生データの読み込みに失敗しました');
      console.error('Error loading students:', err);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [hasMore, isAuthenticated, isMobile, searchQuery, courseFilter, circleFilter, nextOffset, userFavorites]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!isAuthenticated || !hasMore) return;

    let timeoutId: NodeJS.Timeout;
    let observer: IntersectionObserver | null = null;

    const observeCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loadingRef.current) {
        // Clear any existing timeout
        if (timeoutId) clearTimeout(timeoutId);

        // Add a small delay to prevent rapid firing
        timeoutId = setTimeout(() => {
          loadMoreStudents();
        }, 300);
      }
    };

    observer = new IntersectionObserver(observeCallback, {
      rootMargin: '300px', // Start loading 300px before the element is visible
      threshold: 0.1,
    });

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer && currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [loadMoreStudents, hasMore, isAuthenticated]);

  if (!students.length && !isLoading) {
    return (
      <div className="flex justify-center items-center h-32 rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">該当する学生が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <StudentCard key={student.id} {...student} />
        ))}
      </div>

      {/* Loading indicator and intersection observer target */}
      <div
        ref={observerRef}
        className="flex justify-center items-center py-8"
        aria-live="polite"
        aria-label={isLoading ? '学生データを読み込み中' : hasMore ? 'さらに読み込むにはスクロールしてください' : 'すべてのデータを読み込みました'}
      >
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 dark:border-gray-400"></div>
            <span>読み込み中...</span>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <button
              onClick={loadMoreStudents}
              className="btn-secondary text-sm"
              disabled={isLoading}
            >
              再試行
            </button>
          </div>
        )}

        {!hasMore && students.length > 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            すべての学生を表示しました
          </p>
        )}
      </div>
    </div>
  );
};
