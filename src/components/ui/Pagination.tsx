'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
};

export const Pagination = ({ totalPages, currentPage }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ページネーションの範囲を計算
  const [visiblePages, setVisiblePages] = useState<number[]>([]);
  
  useEffect(() => {
    // 表示するページ番号の範囲を決定
    const getVisiblePages = (currentPage: number, totalPages: number) => {
      const maxVisible = 5;
      
      if (totalPages <= maxVisible) {
        // 全ページが表示可能な場合
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      } else {
        // 前後2ページずつ表示
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        // 末尾に到達した場合、開始位置を調整
        if (endPage === totalPages) {
          startPage = Math.max(1, totalPages - maxVisible + 1);
        }
        
        return Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        );
      }
    };
    
    setVisiblePages(getVisiblePages(currentPage, totalPages));
  }, [currentPage, totalPages]);
  
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/?${params.toString()}`);
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex items-center space-x-2">
        {/* 前のページボタン */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md focus-ring ${
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="前のページ"
        >
          <ChevronLeft size={20} />
        </button>
        
        {/* 最初のページ（1ページ目が表示範囲に含まれていない場合） */}
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus-ring"
            >
              1
            </button>
            {visiblePages[0] > 2 && <span className="px-1">...</span>}
          </>
        )}
        
        {/* ページ番号ボタン */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`p-2 rounded-md focus-ring ${
              page === currentPage
                ? 'bg-primary-nut-blue text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        
        {/* 最後のページ（最終ページが表示範囲に含まれていない場合） */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className="px-1">...</span>}
            <button
              onClick={() => goToPage(totalPages)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus-ring"
            >
              {totalPages}
            </button>
          </>
        )}
        
        {/* 次のページボタン */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md focus-ring ${
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="次のページ"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
