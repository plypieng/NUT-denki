'use client';

import { useState, useEffect, useMemo } from 'react';
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
  students: Student[];
};

const ITEMS_PER_LOAD = 12;

export const StudentsGrid = ({ students }: StudentsGridProps) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [isLoading, setIsLoading] = useState(false);

  const visibleStudents = useMemo(() => {
    return students.slice(0, visibleCount);
  }, [students, visibleCount]);

  const hasMore = visibleCount < students.length;

  useEffect(() => {
    // Reset visible count when students change
    setVisibleCount(ITEMS_PER_LOAD);
  }, [students.length]);

  const loadMore = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + ITEMS_PER_LOAD, students.length));
      setIsLoading(false);
    }, 300);
  };

  if (!students.length) {
    return (
      <div className="flex justify-center items-center h-32 rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">該当する学生が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleStudents.map((student) => (
          <StudentCard key={student.id} {...student} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '読み込み中...' : `さらに表示 (${students.length - visibleCount}件)`}
          </button>
        </div>
      )}
    </div>
  );
};
