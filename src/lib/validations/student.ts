import { z } from 'zod';
import { Specialty } from '@/types/schema';

// 学生フォームのバリデーションスキーマ
export const studentSchema = z.object({
  // 必須フィールド
  studentId: z.string().min(1, { message: '学籍番号は必須です' }),
  fullName: z.string().min(1, { message: '氏名は必須です' }),
  birthDate: z.string().min(1, { message: '生年月日は必須です' }),
  hometown: z.string().min(1, { message: '出身地は必須です' }),
  almaMater: z.string().min(1, { message: '出身高校・高専は必須です' }),
  targetCourse: z.nativeEnum(Specialty, {
    errorMap: () => ({ message: '志望専門コースは必須です' }),
  }),
  year: z.string().min(1, { message: '学年は必須です' }),

  // 任意フィールド
  imageUrl: z.string().optional().nullable(),
  starSign: z.string().optional().nullable(),
  kosenDepartment: z.string().optional().nullable(),
  kosenThesis: z.string().optional().nullable(),
  mbti: z.string().optional().nullable(),
  hobby: z.string().optional().nullable(),
  circle: z.string().optional().nullable(),
  lineUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  xUrl: z.string().optional().nullable(),
  likes: z.string().optional().nullable(),
  dislikes: z.string().optional().nullable(),
  goodSubjects: z.string().optional().nullable(),
  etcNote: z.string().optional().nullable(),
});

// 学生フォームの型定義
export type StudentFormValues = z.infer<typeof studentSchema>;
