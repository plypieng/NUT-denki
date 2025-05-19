import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma-client';

// Define validation schema for feedback
const feedbackSchema = z.object({
  type: z.enum(['bug', 'suggestion', 'other']),
  title: z.string().min(3, { message: 'タイトルは3文字以上で入力してください' }).max(100),
  description: z.string().min(10, { message: '詳細は10文字以上で入力してください' }).max(1000),
  email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Get session data to verify user
    const session = await getServerSession();
    
    // Parse request body
    const body = await request.json();
    
    // Validate with zod schema
    const validationResult = feedbackSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: '入力データが無効です', details: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const feedbackData = validationResult.data;
    
    // Verify email matches session if user is logged in
    if (session?.user?.email && session.user.email !== feedbackData.email) {
      return NextResponse.json(
        { error: 'メールアドレスとセッションが一致しません' },
        { status: 403 }
      );
    }
    
    // Save feedback to database
    const feedback = await prisma.feedback.create({
      data: {
        type: feedbackData.type,
        title: feedbackData.title,
        description: feedbackData.description,
        email: feedbackData.email,
        name: feedbackData.name || null,
        // Add submission timestamp
        createdAt: new Date(),
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'フィードバックが正常に送信されました',
      id: feedback.id
    }, { status: 201 });
    
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'フィードバックの送信中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
