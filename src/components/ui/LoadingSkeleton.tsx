export const StudentCardSkeleton = () => {
  return (
    <div className="flex group cursor-pointer transition-all duration-200 hover:scale-[1.02]">
      <div className="w-2 sm:w-8 bg-gray-200 dark:bg-gray-700 animate-pulse" style={{ minWidth: '8px' }}></div>
      <div className="card flex-1 rounded-l-none border-l-0">
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
          <div className="flex flex-col items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="text-sm font-medium mt-1 bg-gray-200 dark:bg-gray-700 h-4 w-16 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col items-center sm:items-start flex-1">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StudentsGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <StudentCardSkeleton key={i} />
      ))}
    </div>
  );
};