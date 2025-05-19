import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma-client';
import { DEPARTMENT_NAMES, DEPARTMENT_COLORS } from '@/types/statistics';

// Helper function to extract prefecture from full address
const extractPrefecture = (hometown: string): string => {
  // Match the prefecture pattern (ends with 都, 道, 府, or 県)
  const prefectureMatch = hometown.match(/([^\s]+[都道府県])/);
  if (prefectureMatch && prefectureMatch[1]) {
    return prefectureMatch[1];
  }
  return hometown; // Return original if no prefecture pattern found
};

// Helper function to normalize MBTI type
const normalizeMbti = (mbti: string | null): string => {
  if (!mbti) return 'Not specified';
  
  // Convert to uppercase and remove spaces
  const cleaned = mbti.toUpperCase().replace(/\s/g, '');
  
  // Take first 4 characters if they match MBTI pattern
  if (cleaned.length >= 4) {
    const firstFour = cleaned.substring(0, 4);
    // Check if it appears to be a valid MBTI type
    if (/^[EI][NS][FT][JP]$/.test(firstFour)) {
      return firstFour;
    }
  }
  
  // If it doesn't match pattern, return original
  return mbti;
};

// Helper function to process word cloud data
const processWordCloudData = (items: any[]): { text: string; value: number }[] => {
  const wordMap = new Map<string, number>();
  
  items.forEach(item => {
    if (item && typeof item === 'string') {
      // Split by common separators and process each word
      const words = item.split(/[,、・/／\s]+/);
      words.forEach(word => {
        const trimmed = word.trim();
        if (trimmed.length > 0) {
          wordMap.set(trimmed, (wordMap.get(trimmed) || 0) + 1);
        }
      });
    }
  });
  
  // Convert map to array and sort by frequency
  return Array.from(wordMap.entries())
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 30); // Limit to top 30 words
};

// Static data for total students per year
const TOTAL_STUDENTS_BY_YEAR = {
  'B1': 125,
  'B2': 128,
  'B3': 132, // As specified in the requirements
  'B4': 130
};

// We're now importing DEPARTMENT_NAMES and DEPARTMENT_COLORS from @/types/statistics

// Helper function to calculate percentages
const calculatePercentage = (count: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
};

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching statistics data...');
    // Get session data to verify user
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // Check if user has a profile
    const userProfile = await prisma.student.findFirst({
      where: { ownerEmail: session.user.email } as any
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: 'プロフィールを登録してからアクセスしてください' },
        { status: 403 }
      );
    }

    // 1. Total registered students
    const totalStudents = await prisma.student.count();

    // 2. Students by year
    const studentsByYear = await prisma.student.groupBy({
      by: ['year'],
      _count: {
        id: true
      }
    });

    // 3. Students by course
    const studentsByCourse = await prisma.student.groupBy({
      by: ['targetCourse'],
      _count: {
        id: true
      }
    });

    // 4. Students by course and year (more detailed breakdown)
    const studentsByCourseAndYear = await prisma.student.groupBy({
      by: ['targetCourse', 'year'],
      _count: {
        id: true
      }
    });

    // 5. Students by blood type
    const studentsByBloodType = await prisma.student.groupBy({
      by: ['bloodType'] as any,
      _count: {
        id: true
      }
    });

    // 6. Students by hometown (extract prefecture)
    // First get all students with hometown data
    let studentsByPrefecture: Array<{prefecture: string, count: number}> = [];
    
    try {
      // Use a simpler query that doesn't use the problematic "not: null" condition
      const studentsWithHometown = await prisma.student.findMany({
        select: {
          hometown: true
        }
      });
      
      // Extract prefectures and count them
      const prefectureMap = new Map<string, number>();
      
      studentsWithHometown.forEach(student => {
        if (student.hometown) {
          const prefecture = extractPrefecture(student.hometown);
          prefectureMap.set(prefecture, (prefectureMap.get(prefecture) || 0) + 1);
        }
      });
      
      // Convert to array and sort
      studentsByPrefecture = Array.from(prefectureMap.entries())
        .map(([prefecture, count]) => ({ prefecture, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 prefectures
    } catch (err) {
      console.error('Error processing prefecture data:', err);
      // Use empty array on error
      studentsByPrefecture = [];
    }
    
    // Prefecture data is now handled in the try-catch block above

    // 7. Students by star sign
    const studentsByStarSign = await prisma.student.groupBy({
      by: ['starSign'] as any,
      _count: {
        id: true
      }
    });
    
    // 8. MBTI Distribution
    let studentsByMbti: Array<{mbtiType: string, count: number}> = [];
    try {
      // Get all students and filter non-null MBTI values in JavaScript rather than in the query
      const studentsWithMbti = await prisma.student.findMany({
        select: {
          mbti: true
        }
      });
      
      // Normalize and count MBTI types
      const mbtiMap = new Map<string, number>();
      studentsWithMbti.forEach(student => {
        if (student.mbti) {
          const normalizedMbti = normalizeMbti(student.mbti);
          mbtiMap.set(normalizedMbti, (mbtiMap.get(normalizedMbti) || 0) + 1);
        }
      });
      
      // Convert to array and sort
      studentsByMbti = Array.from(mbtiMap.entries())
        .map(([mbtiType, count]) => ({ mbtiType, count }))
        .sort((a, b) => b.count - a.count);
    } catch (err) {
      console.error('Error fetching MBTI data:', err);
      // Return empty array on error
      studentsByMbti = [];
    }
      
    // 9. Word clouds for hobbies, circles, likes, and dislikes
    let hobbyWords: Array<{text: string, value: number}> = [];
    let circleWords: Array<{text: string, value: number}> = [];
    let likesWords: Array<{text: string, value: number}> = [];
    let dislikesWords: Array<{text: string, value: number}> = [];
    
    try {
      const studentsWithWordCloudData = await prisma.student.findMany({
        select: {
          hobby: true,
          circle: true,
          likes: true,
          dislikes: true,
        }
      });
      
      // Process word cloud data
      hobbyWords = processWordCloudData(studentsWithWordCloudData.map(s => s.hobby).filter(Boolean));
      circleWords = processWordCloudData(studentsWithWordCloudData.map(s => s.circle).filter(Boolean));
      likesWords = processWordCloudData(studentsWithWordCloudData.map(s => s.likes).filter(Boolean));
      dislikesWords = processWordCloudData(studentsWithWordCloudData.map(s => s.dislikes).filter(Boolean));
    } catch (err) {
      console.error('Error fetching word cloud data:', err);
      // Use empty arrays on error
    }

    // Format the data for the frontend with percentages
    const formattedStudentsByYear = Object.entries(TOTAL_STUDENTS_BY_YEAR).map(([year, totalCount]) => {
      const registeredData = studentsByYear.find(item => item.year === year);
      const registeredCount = registeredData && registeredData._count && registeredData._count.id ? registeredData._count.id : 0;
      const percentage = calculatePercentage(registeredCount, totalCount);

      return {
        year,
        registeredCount,
        totalCount,
        percentage
      };
    });

    // Format course data by year with percentages
    const formattedCourseByYear: Record<string, any[]> = {};
    
    studentsByCourseAndYear.forEach(item => {
      if (!formattedCourseByYear[item.year]) {
        formattedCourseByYear[item.year] = [];
      }
      
      // Find total registered students for this year
      const yearData = studentsByYear.find(y => y.year === item.year);
      const totalRegisteredInYear = yearData && yearData._count && yearData._count.id ? yearData._count.id : 0;
      
      // Calculate percentage against registered students in that year
      const count = item._count && item._count.id ? item._count.id : 0;
      const percentage = calculatePercentage(count, totalRegisteredInYear);
      
      formattedCourseByYear[item.year].push({
        course: item.targetCourse,
        courseName: DEPARTMENT_NAMES[item.targetCourse] || item.targetCourse,
        count,
        percentage,
        color: DEPARTMENT_COLORS[item.targetCourse] || '#CBD5E0'
      });
    });

    return NextResponse.json({
      totalStudents,
      studentsByYear: formattedStudentsByYear,
      studentsByCourse: studentsByCourse.map(item => ({
        course: item.targetCourse,
        courseName: DEPARTMENT_NAMES[item.targetCourse] || item.targetCourse,
        count: item._count && item._count.id ? item._count.id : 0,
        percentage: calculatePercentage(item._count && item._count.id ? item._count.id : 0, totalStudents),
        color: DEPARTMENT_COLORS[item.targetCourse] || '#CBD5E0'
      })),
      studentsByCourseAndYear: formattedCourseByYear,
      studentsByBloodType: studentsByBloodType.map(item => ({
        bloodType: item.bloodType || 'Not specified',
        count: item._count && item._count.id ? item._count.id : 0,
        percentage: calculatePercentage(item._count && item._count.id ? item._count.id : 0, totalStudents)
      })),
      // Updated to use prefecture data
      studentsByPrefecture: studentsByPrefecture.map(item => ({
        prefecture: item.prefecture,
        count: item.count,
        percentage: calculatePercentage(item.count, totalStudents)
      })),
      studentsByStarSign: studentsByStarSign.map(item => ({
        starSign: item.starSign || 'Not specified',
        count: item._count && item._count.id ? item._count.id : 0,
        percentage: calculatePercentage(item._count && item._count.id ? item._count.id : 0, totalStudents)
      })),
      // New MBTI data
      studentsByMbti: studentsByMbti.map(item => ({
        mbtiType: item.mbtiType,
        count: item.count,
        percentage: calculatePercentage(item.count, totalStudents)
      })),
      // Word cloud data
      wordClouds: {
        hobbies: hobbyWords,
        circles: circleWords,
        likes: likesWords,
        dislikes: dislikesWords
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Statistics fetch error:', error);
    return NextResponse.json(
      { error: '統計情報の取得中にエラーが発生しました', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
