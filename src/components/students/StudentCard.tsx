'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pin, Star } from 'lucide-react';
import { formatCourseWithDepartment, SpecialtyToDepartment, DepartmentColors, type SpecialtyType } from '@/types/schema';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

type StudentCardProps = {
  id: string;
  fullName: string;
  studentId: string;
  imageUrl?: string | null;
  targetCourse: SpecialtyType;
  circle?: string | null;
  caption?: string | null;
  year?: string;
  isPinned?: boolean;
  isFavorited?: boolean;
  ownerEmail?: string | null;
};

export const StudentCard = ({
  id,
  fullName,
  studentId,
  imageUrl,
  targetCourse,
  circle,
  caption,
  year,
  isPinned = false,
  isFavorited = false,
  ownerEmail,
}: StudentCardProps) => {
  // Get the department color based on the student's specialty
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const [pinned, setPinned] = useState(isPinned);
  const [favorited, setFavorited] = useState(isFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const isOwner = ownerEmail === userEmail;
  
  const getDepartmentColor = () => {
    const department = SpecialtyToDepartment[targetCourse];
    return department ? DepartmentColors[department] : DepartmentColors.DEFAULT;
  };

  const cardColorClass = getDepartmentColor();
  
  const handlePinClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from navigating
    
    if (!isOwner || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/students/pin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPinned(data.isPinned);
        toast.success(data.message);
      } else {
        toast.error(data.error || 'ピン留め処理に失敗しました');
      }
    } catch (error) {
      toast.error('ピン留め処理に失敗しました');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from navigating
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/students/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: id }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFavorited(data.isFavorited);
        toast.success(data.message);
      } else {
        toast.error(data.error || 'お気に入り処理に失敗しました');
      }
    } catch (error) {
      toast.error('お気に入り処理に失敗しました');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/student/${id}`} className="block relative">
      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        {isOwner && (
          <button
            onClick={handlePinClick}
            disabled={isLoading}
            className={`p-1.5 rounded-full ${pinned ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'} hover:opacity-80 transition-all`}
            title={pinned ? 'ピン留め解除' : 'ピン留め'}
          >
            <Pin size={14} />
          </button>
        )}
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={`p-1.5 rounded-full ${favorited ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'} hover:opacity-80 transition-all`}
          title={favorited ? 'お気に入り解除' : 'お気に入り追加'}
        >
          <Star size={14} />
        </button>
      </div>
      
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
            {caption && (
              <p className="text-xs italic text-gray-600 dark:text-gray-300 mt-2 max-w-[200px] line-clamp-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                “{caption}”
              </p>
            )}
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
};
