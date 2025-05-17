'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCourseWithDepartment, SpecialtyToDepartment, DepartmentColors, type SpecialtyType } from '@/types/schema';

type StudentCardProps = {
  id: string;
  fullName: string;
  studentId: string;
  imageUrl?: string | null;
  targetCourse: SpecialtyType;
  circle?: string | null;
  year?: string;
};

export const StudentCard = ({
  id,
  fullName,
  studentId,
  imageUrl,
  targetCourse,
  circle,
  year,
}: StudentCardProps) => {
  // Get the department color based on the student's specialty
  const getDepartmentColor = () => {
    const department = SpecialtyToDepartment[targetCourse];
    return department ? DepartmentColors[department] : DepartmentColors.DEFAULT;
  };

  const cardColorClass = getDepartmentColor();

  return (
    <Link href={`/student/${id}`}>
      <div className="flex group cursor-pointer transition-all duration-200 hover:scale-[1.02]">
        <div className={`w-2 sm:w-8 ${cardColorClass}`} style={{minWidth: '8px'}}></div>
        <div className="card flex-1 rounded-l-none border-l-0">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={fullName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100px, 96px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-500 dark:text-gray-400">
                写真なし
              </div>
            )}
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-nut-blue dark:group-hover:text-primary-nut-blue transition-colors">
              {fullName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{studentId}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {formatCourseWithDepartment(targetCourse, true, year)}
            </p>
            {circle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                サークル: {circle}
              </p>
            )}
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
};
