'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { TagCloud } from 'react-tagcloud';
import { 
  DEPARTMENT_NAMES,
  DEPARTMENT_COLORS,
  StatisticsData,
  CourseStatistic,
  WordCloudItem
} from '@/types/statistics';
import { Specialty } from '@/types/schema';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

// Now importing StatisticsData type from '@/types/statistics'

export default function StatisticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>("B3");

  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        toast.error('統計情報を閲覧するにはログインが必要です');
        router.push('/');
        return;
      }

      try {
        const response = await fetch('/api/statistics');
        
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 403) {
            toast.error('プロフィールを登録してからアクセスしてください');
            router.push('/student/new');
            return;
          }
          throw new Error(errorData.error || '統計情報の取得に失敗しました');
        }
        
        const data = await response.json();
        setStatisticsData(data);
        
        // Set default selected year if data exists
        if (data.studentsByYear && data.studentsByYear.length > 0) {
          setSelectedYear(data.studentsByYear[0].year);
        }
        
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('統計情報の取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [status, router]);

  // Handle year selection for detailed course breakdown
  const handleYearSelection = (year: string) => {
    setSelectedYear(year);
  };

  // Render loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse text-xl">統計情報を読み込み中...</div>
        </div>
      </MainLayout>
    );
  }

  // Render error state
  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-accent-nut-red text-xl">{error}</div>
        </div>
      </MainLayout>
    );
  }

  // Render empty state
  if (!statisticsData) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-xl">統計情報がありません</div>
        </div>
      </MainLayout>
    );
  }

  // Prepare data for charts
  const yearChartData = {
    labels: statisticsData.studentsByYear.map(item => `${item.year}年生`),
    datasets: [
      {
        label: '登録者数',
        data: statisticsData.studentsByYear.map(item => item.registeredCount),
        backgroundColor: '#0064B6',
      },
      {
        label: '総数',
        data: statisticsData.studentsByYear.map(item => item.totalCount),
        backgroundColor: '#E2E8F0',
      }
    ],
  };

  const yearPercentageData = {
    labels: statisticsData.studentsByYear.map(item => `${item.year}年生`),
    datasets: [
      {
        label: '登録率',
        data: statisticsData.studentsByYear.map(item => item.percentage),
        backgroundColor: '#0064B6',
      }
    ],
  };

  const courseChartData = {
    labels: statisticsData.studentsByCourse.map(item => item.courseName),
    datasets: [
      {
        data: statisticsData.studentsByCourse.map(item => item.count),
        backgroundColor: statisticsData.studentsByCourse.map(item => item.color),
      }
    ],
  };

  const bloodTypeChartData = {
    labels: statisticsData.studentsByBloodType.map(item => item.bloodType),
    datasets: [
      {
        data: statisticsData.studentsByBloodType.map(item => item.count),
        backgroundColor: [
          '#F56565', // A
          '#4299E1', // B
          '#48BB78', // O
          '#9F7AEA', // AB
          '#CBD5E0', // Unknown
        ],
      }
    ],
  };
  
  // MBTI Chart data
  const mbtiChartData = {
    labels: statisticsData.studentsByMbti.map(item => item.mbtiType),
    datasets: [
      {
        data: statisticsData.studentsByMbti.map(item => item.count),
        backgroundColor: [
          '#3182CE', '#E53E3E', '#38A169', '#D69E2E',
          '#805AD5', '#DD6B20', '#319795', '#B794F4',
          '#F56565', '#48BB78', '#4299E1', '#9F7AEA',
          '#F6AD55', '#ED8936', '#48BB78', '#4C51BF',
        ],
      }
    ],
  };

  const starSignChartData = {
    labels: statisticsData.studentsByStarSign.map(item => item.starSign),
    datasets: [
      {
        data: statisticsData.studentsByStarSign.map(item => item.count),
        backgroundColor: [
          '#F6AD55', '#F56565', '#ED8936', '#48BB78', 
          '#38B2AC', '#4299E1', '#667EEA', '#9F7AEA', 
          '#D53F8C', '#FC8181', '#68D391', '#4FD1C5',
        ],
      }
    ],
  };
  
  // Prefecture chart data
  const prefectureChartData = {
    labels: statisticsData.studentsByPrefecture.map(item => item.prefecture),
    datasets: [
      {
        data: statisticsData.studentsByPrefecture.map(item => item.count),
        backgroundColor: [
          '#3182CE', '#E53E3E', '#38A169', '#D69E2E', '#805AD5',
          '#DD6B20', '#319795', '#B794F4', '#F56565', '#48BB78',
        ],
      }
    ],
  };
  
  // Common chart options
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      }
    }
  };
  
  // Tag cloud options
  const tagCloudOptions = {
    luminosity: 'light',
    hue: 'blue',
    fontFamily: 'Noto Sans JP, sans-serif',
    fontSizes: [15, 30],
    randomSeed: 42
  };

  // Prepare courseByYear chart data based on selected year
  const selectedYearData = selectedYear && statisticsData.studentsByCourseAndYear[selectedYear] || [];
  const courseByYearChartData = selectedYearData ? {
    labels: selectedYearData.map(item => item.courseName),
    datasets: [
      {
        data: selectedYearData.map(item => item.count),
        backgroundColor: selectedYearData.map(item => item.color),
      }
    ],
  } : null;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">学生統計ダッシュボード</h1>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 bg-white dark:bg-gray-800 shadow-md">
            <h3 className="text-lg font-semibold mb-2">総学生数</h3>
            <div className="text-3xl font-bold text-primary-nut-blue">
              {statisticsData.totalStudents}
            </div>
            <p className="text-sm text-gray-500 mt-1">登録済み</p>
          </div>
          
          <div className="card p-6 bg-white dark:bg-gray-800 shadow-md">
            <h3 className="text-lg font-semibold mb-2">B3登録率</h3>
            <div className="text-3xl font-bold text-primary-nut-blue">
              {statisticsData.studentsByYear.find(y => y.year === 'B3')?.percentage || 0}%
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {statisticsData.studentsByYear.find(y => y.year === 'B3')?.registeredCount || 0} / 132 B3学生
            </p>
          </div>
          
          <div className="card p-6 bg-white dark:bg-gray-800 shadow-md">
            <h3 className="text-lg font-semibold mb-2">最多専攻</h3>
            <div className="text-3xl font-bold text-primary-nut-blue">
              {statisticsData.studentsByCourse.length > 0 
                ? statisticsData.studentsByCourse[0].courseName
                : '該当なし'
              }
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {statisticsData.studentsByCourse.length > 0 
                ? `${statisticsData.studentsByCourse[0].count}人 (${statisticsData.studentsByCourse[0].percentage}%)`
                : '0人'
              }
            </p>
          </div>
        </div>
        
        {/* Students by Year */}
        <div className="card p-6 bg-white dark:bg-gray-800 shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">学年別登録者数と登録率</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg mb-3">登録者数 vs 総学生数</h3>
              <div className="h-72">
                <Bar 
                  data={yearChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const index = context.dataIndex;
                            const year = statisticsData.studentsByYear[index];
                            return context.dataset.label === '登録者数'
                              ? `登録者数: ${year.registeredCount}人`
                              : `総学生数: ${year.totalCount}人`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: '人数'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg mb-3">登録率 (%)</h3>
              <div className="h-72">
                <Bar 
                  data={yearPercentageData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const index = context.dataIndex;
                            const year = statisticsData.studentsByYear[index];
                            return `登録率: ${year.percentage}% (${year.registeredCount}/${year.totalCount})`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: '登録率 (%)'
                        },
                        max: 100
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Year Selector */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {statisticsData.studentsByYear.map(yearData => (
              <button
                key={yearData.year}
                type="button"
                onClick={() => handleYearSelection(yearData.year)}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedYear === yearData.year
                    ? 'bg-primary-nut-blue text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                } border border-gray-200 dark:border-gray-600 ${yearData.year === 'B1' ? 'rounded-l-lg' : ''} ${yearData.year === 'B4' ? 'rounded-r-lg' : ''}`}
              >
                {yearData.year}
              </button>
            ))}
          </div>
        </div>
        
        {/* Course Distribution by Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="card p-6 bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-4">専攻別分布</h2>
            <div className="h-72">
              <Doughnut
                data={courseChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const index = context.dataIndex;
                          const data = statisticsData.studentsByCourse[index];
                          return `${data.courseName}: ${data.count}人 (${data.percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {courseByYearChartData && (
            <div className="card p-6 bg-white dark:bg-gray-800 shadow-md">
              <h2 className="text-xl font-semibold mb-4">{selectedYear}年生 専攻別分布</h2>
              <div className="h-72">
                <Pie
                  data={courseByYearChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const index = context.dataIndex;
                            if (index >= 0 && index < selectedYearData.length) {
                              const data = selectedYearData[index] as CourseStatistic;
                              return `${data.courseName}: ${data.count}人 (${data.percentage}%)`;
                            }
                            return '';
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Blood Types */}
          <div className="card p-6 bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-4">血液型分布</h2>
            <div className="h-72">
              <Pie
                data={bloodTypeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const index = context.dataIndex;
                          const data = statisticsData.studentsByBloodType[index];
                          return `${data.bloodType}: ${data.count}人 (${data.percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Star Signs */}
          <div className="card p-6 bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-4">星座分布</h2>
            <div className="h-72">
              <Doughnut
                data={starSignChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const index = context.dataIndex;
                          const data = statisticsData.studentsByStarSign[index];
                          return `${data.starSign}: ${data.count}人 (${data.percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Top Prefectures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="card p-6 bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-4">都道府県分布 TOP 10</h2>
            <div className="h-72">
              <Pie
                data={prefectureChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const index = context.dataIndex;
                          const data = statisticsData.studentsByPrefecture[index];
                          return `${data.prefecture}: ${data.count}人 (${data.percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* MBTI Distribution */}
          <div className="card p-6 bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-4">MBTI分布</h2>
            <div className="h-72">
              <Doughnut
                data={mbtiChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const index = context.dataIndex;
                          if (index >= 0 && index < statisticsData.studentsByMbti.length) {
                            const data = statisticsData.studentsByMbti[index];
                            return `${data.mbtiType}: ${data.count}人 (${data.percentage}%)`;
                          }
                          return '';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Word Cloud Section - Using react-tagcloud */}
        <div className="space-y-8 mb-8">
          <h2 className="text-xl font-semibold">ワードクラウド分析</h2>
          
          {/* Hobbies Word Cloud */}
          <div className="card p-6 bg-white dark:bg-gray-800 shadow-md">
            <h3 className="text-lg font-semibold mb-4">趣味の傾向</h3>
            <div className="h-80 w-full flex items-center justify-center">
              {statisticsData.wordClouds.hobbies && statisticsData.wordClouds.hobbies.length > 0 ? (
                <div className="p-4 w-full h-full overflow-hidden flex justify-center items-center">
                  <TagCloud
                    minSize={14}
                    maxSize={35}
                    tags={statisticsData.wordClouds.hobbies.map((item, index) => ({
                      value: item.text,
                      count: item.value,
                      key: `hobby-${index}-${item.text}`
                    }))}
                    className="text-center"
                  />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  データが不足しています
                </div>
              )}
            </div>
          </div>
          
          {/* Likes & Dislikes Word Clouds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-6 bg-white dark:bg-gray-800 shadow-md">
              <h3 className="text-lg font-semibold mb-4">好きなもの</h3>
              <div className="h-60 w-full flex items-center justify-center">
                {statisticsData.wordClouds.likes && statisticsData.wordClouds.likes.length > 0 ? (
                  <div className="p-4 w-full h-full overflow-hidden flex justify-center items-center">
                    <TagCloud
                      minSize={12}
                      maxSize={30}
                      tags={statisticsData.wordClouds.likes.map((item, index) => ({
                        value: item.text,
                        count: item.value,
                        key: `like-${index}-${item.text}`
                      }))}
                      className="text-center"
                      colorOptions={{
                        luminosity: 'light',
                        hue: 'green',
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    データが不足しています
                  </div>
                )}
              </div>
            </div>
            
            <div className="card p-6 bg-white dark:bg-gray-800 shadow-md">
              <h3 className="text-lg font-semibold mb-4">嫌いなもの</h3>
              <div className="h-60 w-full flex items-center justify-center">
                {statisticsData.wordClouds.dislikes && statisticsData.wordClouds.dislikes.length > 0 ? (
                  <div className="p-4 w-full h-full overflow-hidden flex justify-center items-center">
                    <TagCloud
                      minSize={12}
                      maxSize={30}
                      tags={statisticsData.wordClouds.dislikes.map((item, index) => ({
                        value: item.text,
                        count: item.value,
                        key: `dislike-${index}-${item.text}`
                      }))}
                      className="text-center"
                      colorOptions={{
                        luminosity: 'light',
                        hue: 'red',
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    データが不足しています
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Circles Word Cloud */}
          <div className="card p-6 bg-white dark:bg-gray-800 shadow-md">
            <h3 className="text-lg font-semibold mb-4">サークル・部活</h3>
            <div className="h-80 w-full flex items-center justify-center">
              {statisticsData.wordClouds.circles && statisticsData.wordClouds.circles.length > 0 ? (
                <div className="p-4 w-full h-full overflow-hidden flex justify-center items-center">
                  <TagCloud
                    minSize={14}
                    maxSize={35}
                    tags={statisticsData.wordClouds.circles.map((item, index) => ({
                      value: item.text,
                      count: item.value,
                      key: `circle-${index}-${item.text}`
                    }))}
                    className="text-center"
                    colorOptions={{
                      luminosity: 'light',
                      hue: 'purple',
                    }}
                  />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  データが不足しています
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
