import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-client';
import { getServerSession } from 'next-auth';

// Toggle pinned status for a student profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // 認証チェック
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    const data = await request.json();
    const { id } = data;
    
    if (!id) {
      return NextResponse.json({ error: "学生IDが必要です" }, { status: 400 });
    }

    // Get the student profile
    const student = await prisma.student.findUnique({
      where: { id },
    });
    
    if (!student) {
      return NextResponse.json({ error: "学生が見つかりません" }, { status: 404 });
    }
    
    // Check if the user is the owner of the profile
    if ((student as any).ownerEmail !== session.user.email) {
      return NextResponse.json({ 
        error: "自分のプロフィールのみピン留めできます" 
      }, { status: 403 });
    }
    
    // Toggle the pinned status - using type assertion until Prisma client is updated
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: { isPinned: !(student as any).isPinned } as any,
    });
    
    return NextResponse.json({
      isPinned: (updatedStudent as any).isPinned,
      message: (updatedStudent as any).isPinned ? "プロフィールをピン留めしました" : "プロフィールのピン留めを解除しました"
    });
    
  } catch (error: any) {
    console.error("ピン留め処理エラー:", error);
    return NextResponse.json({ error: "ピン留め処理に失敗しました" }, { status: 500 });
  }
}
