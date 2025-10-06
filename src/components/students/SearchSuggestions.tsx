'use client';

import { useState, useEffect } from 'react';
import { Search, Clock, TrendingUp } from 'lucide-react';

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
}

const POPULAR_SEARCHES = [
  'B4', 'B3', '電気エネルギー', '電子デバイス', '情報通信',
  'サッカー', 'バスケ', 'テニス', '軽音', '写真'
];

const MAX_RECENT_SEARCHES = 5;

export const SearchSuggestions = ({ query, onSuggestionClick, isVisible }: SearchSuggestionsProps) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Save search to recent searches
  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSuggestionClick = (suggestion: string) => {
    saveRecentSearch(suggestion);
    onSuggestionClick(suggestion);
  };

  if (!isVisible || (!query && recentSearches.length === 0)) return null;

  const filteredPopular = POPULAR_SEARCHES.filter(
    item => item.toLowerCase().includes(query.toLowerCase()) && !recentSearches.includes(item)
  );

  return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 mt-1 max-h-80 overflow-y-auto">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="p-2">
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} />
            <span>最近の検索</span>
          </div>
          {recentSearches.map((search, index) => (
            <button
              key={`recent-${index}`}
              onClick={() => handleSuggestionClick(search)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center gap-2"
            >
              <Search size={14} className="text-gray-400" />
              <span>{search}</span>
            </button>
          ))}
        </div>
      )}

      {/* Popular Searches */}
      {filteredPopular.length > 0 && (
        <div className="p-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
            <TrendingUp size={14} />
            <span>人気の検索</span>
          </div>
          {filteredPopular.slice(0, 5).map((search, index) => (
            <button
              key={`popular-${index}`}
              onClick={() => handleSuggestionClick(search)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center gap-2"
            >
              <TrendingUp size={14} className="text-gray-400" />
              <span>{search}</span>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {query && recentSearches.length === 0 && filteredPopular.length === 0 && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <Search size={16} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">検索候補が見つかりません</p>
        </div>
      )}
    </div>
  );
};