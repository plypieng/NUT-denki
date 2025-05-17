'use client';

import type { SpecialtyType } from '@/types/schema';
import { StudentCard } from './StudentCard';

type Student = {
  id: string;
  fullName: string;
  studentId: string;
  imageUrl?: string | null;
  targetCourse: SpecialtyType;
  circle?: string | null;
};

type StudentsGridProps = {
  students: Student[];
};

export const StudentsGrid = ({ students }: StudentsGridProps) => {
  if (!students.length) {
    return (
      <div className="flex justify-center items-center h-32 rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">該当する学生が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {students.map((student) => (
        <StudentCard key={student.id} {...student} />
      ))}
    </div>
  );
};
