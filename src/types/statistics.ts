import { Specialty } from './schema';

// Department names for visualization
export const DEPARTMENT_NAMES: Record<string, string> = {
  'DENKI_ENERGY_CONTROL': '電気・制御システム工学',
  'DENSHI_DEVICE_OPTICAL': '電子デバイス・光学',
  'JOHO_COMMUNICATION': '情報・通信システム工学',
  'KIKAI_SYSTEM': '機械システム工学',
  'BUSSHITSU_MATERIALS': '物質材料工学',
  '電気電子情報工学コース': '電気電子情報工学コース（旧）'
};

// Department colors for visualization
export const DEPARTMENT_COLORS: Record<string, string> = {
  'DENKI_ENERGY_CONTROL': '#4299E1', // blue
  'DENSHI_DEVICE_OPTICAL': '#48BB78', // green
  'JOHO_COMMUNICATION': '#F6AD55', // orange
  'KIKAI_SYSTEM': '#9F7AEA', // purple
  'BUSSHITSU_MATERIALS': '#F56565', // red
  '電気電子情報工学コース': '#718096' // gray
};

// Types for statistics data
export type YearStatistic = {
  year: string;
  registeredCount: number;
  totalCount: number;
  percentage: number;
};

export type CourseStatistic = {
  course: string;
  courseName: string;
  count: number;
  percentage: number;
  color: string;
};

export type BloodTypeStatistic = {
  bloodType: string;
  count: number;
  percentage: number;
};

export type PrefectureStatistic = {
  prefecture: string;
  count: number;
  percentage: number;
};

export type MbtiStatistic = {
  mbtiType: string;
  count: number;
  percentage: number;
};

export type WordCloudItem = {
  text: string;
  value: number;
};

export type WordClouds = {
  hobbies: WordCloudItem[];
  circles: WordCloudItem[];
  likes: WordCloudItem[];
  dislikes: WordCloudItem[];
};

export type StarSignStatistic = {
  starSign: string;
  count: number;
  percentage: number;
};

export type StatisticsData = {
  totalStudents: number;
  studentsByYear: YearStatistic[];
  studentsByCourse: CourseStatistic[];
  studentsByCourseAndYear: Record<string, CourseStatistic[]>;
  studentsByBloodType: BloodTypeStatistic[];
  studentsByPrefecture: PrefectureStatistic[];
  studentsByStarSign: StarSignStatistic[];
  studentsByMbti: MbtiStatistic[];
  wordClouds: WordClouds;
};
