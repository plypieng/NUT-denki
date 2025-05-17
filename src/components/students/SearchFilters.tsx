'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { Specialty, Department, DepartmentLabels, SpecialtyLabels, SpecialtyToDepartment } from '@/types/schema';

export const SearchFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 現在のURL検索パラメータから状態を初期化
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [courseFilter, setCourseFilter] = useState(searchParams.get('course') || '');
  const [circleFilter, setCircleFilter] = useState(searchParams.get('circle') || '');
  const [yearFilter, setYearFilter] = useState(searchParams.get('year') || '');
  
  // 検索処理を遅延させるための状態
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  
  // 検索クエリのディバウンス処理
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [search]);
  
  // URLパラメータの更新処理
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (courseFilter) params.set('course', courseFilter);
    if (circleFilter) params.set('circle', circleFilter);
    if (yearFilter) params.set('year', yearFilter);
    
    // ページを1に戻す
    params.set('page', '1');
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  }, [debouncedSearch, courseFilter, circleFilter, yearFilter, router]);
  
  // 検索入力の処理
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  // コースフィルターの処理
  const handleCourseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCourseFilter(e.target.value);
  };
  
  // サークルフィルターの処理
  const handleCircleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCircleFilter(e.target.value);
  };
  
  // 学年フィルターの処理
  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setYearFilter(e.target.value);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 検索フィールド */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="名前、学籍番号、出身地など..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus-ring text-gray-900 dark:text-white"
          />
        </div>
        
        {/* 専攜分野と専門コースフィルター */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Filter size={18} />
          </div>
          <select
            value={courseFilter}
            onChange={handleCourseChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus-ring text-gray-900 dark:text-white appearance-none"
          >
            <option value="">全ての専攜分野・専門コース</option>
            
            {/* 電気電子情報工学分野 */}
            <optgroup label={DepartmentLabels[Department.DENKI]}>
              {/* 分野全体でのフィルタリングオプション */}
              <option value={`department:${Department.DENKI}`}>電気電子情報工学分野（全て）</option>
              <option value={Specialty.DENKI_ENERGY_CONTROL}>電気エネルギー・制御工学</option>
              <option value={Specialty.DENSHI_DEVICE_OPTICAL}>電子デバイス・光波制御工学</option>
              <option value={Specialty.JOHO_COMMUNICATION}>情報通信制御工学</option>
            </optgroup>
            
            {/* 他の専攜分野は準備中 */}
            <optgroup label="その他の専攜分野（準備中）">
              <option disabled>{DepartmentLabels[Department.KIKAI]}</option>
              <option disabled>{DepartmentLabels[Department.JOHO_KEIEI]}</option>
              <option disabled>{DepartmentLabels[Department.BUSSHITSU_SEIBUTSU]}</option>
              <option disabled>{DepartmentLabels[Department.KANKYO_SHAKAI]}</option>
              <option disabled>{DepartmentLabels[Department.RYOSHI_GENSHIRYOKU]}</option>
              <option disabled>{DepartmentLabels[Department.SYSTEM_SAFETY]}</option>
            </optgroup>
          </select>
        </div>
        
        {/* サークルフィルター */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Filter size={18} />
          </div>
          <input
            type="text"
            value={circleFilter}
            onChange={handleCircleChange}
            placeholder="サークル検索..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus-ring text-gray-900 dark:text-white"
          />
        </div>
        
        {/* 学年フィルター */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Filter size={18} />
          </div>
          <select
            value={yearFilter}
            onChange={handleYearChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus-ring text-gray-900 dark:text-white appearance-none"
          >
            <option value="">学年（全て）</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="B3">B3</option>
            <option value="B4">B4</option>
          </select>
        </div>
      </div>
    </div>
  );
};
