'use client';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-100-dark border-t border-gray-200 dark:border-gray-800 py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} 長岡技術科学大学 電気電子情報工学専攻
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://www.nagaokaut.ac.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-nut-blue dark:text-blue-400 hover:underline focus-ring"
            >
              大学ホームページ
            </a>
            <a
              href="https://denki.nagaokaut.ac.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-nut-blue dark:text-blue-400 hover:underline focus-ring"
            >
              専攻ページ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
