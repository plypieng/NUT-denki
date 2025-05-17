'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SortAsc, SortDesc, Calendar, AlignLeft } from 'lucide-react';

type SortOption = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

export const SortingOptions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Get current sort option from URL or default to fullName:asc
  const currentSort = searchParams.get('sort') || 'fullName:asc';
  const [field, direction] = currentSort.split(':');
  
  // Available sort options
  const sortOptions: SortOption[] = [
    { label: '氏名 (昇順)', value: 'fullName:asc', icon: <AlignLeft size={16} /> },
    { label: '氏名 (降順)', value: 'fullName:desc', icon: <AlignLeft size={16} /> },
    { label: '学籍番号 (昇順)', value: 'studentId:asc', icon: <SortAsc size={16} /> },
    { label: '学籍番号 (降順)', value: 'studentId:desc', icon: <SortDesc size={16} /> },
    { label: '誕生日 (昇順)', value: 'birthDate:asc', icon: <Calendar size={16} /> },
    { label: '誕生日 (降順)', value: 'birthDate:desc', icon: <Calendar size={16} /> },
  ];
  
  // Find the current sort option for display
  const currentSortOption = sortOptions.find(option => option.value === currentSort) || sortOptions[0];
  
  // Handle sorting change
  const handleSortChange = (value: string) => {
    setIsOpen(false);
    
    // Create new URL with updated sort parameter
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    
    // Reset page to 1 when sorting changes
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">並び順:</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-800"
        >
          <span className="text-gray-600 dark:text-gray-300">{currentSortOption.label}</span>
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 z-20">
          <div className="py-1 divide-y divide-gray-200 dark:divide-gray-700">
            {sortOptions.map(option => (
              <button
                key={option.value}
                className={`w-full text-left px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                  ${option.value === currentSort ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                onClick={() => handleSortChange(option.value)}
              >
                <span className="text-gray-500 dark:text-gray-400">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
