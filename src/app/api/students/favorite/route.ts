import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-client';
import { getServerSession } from 'next-auth';

// Toggle favorite status for a student profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // 認証チェック
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    const data = await request.json();
    const { studentId } = data;
    
    if (!studentId) {
      return NextResponse.json({ error: "学生IDが必要です" }, { status: 400 });
    }

    const userEmail = session.user.email;

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });
    
    if (!student) {
      return NextResponse.json({ error: "学生が見つかりません" }, { status: 404 });
    }
    
    // Check if already favorited - using type assertion until Prisma client is regenerated
    const existingFavorite = await (prisma as any).userFavorite.findUnique({
      where: {
        userEmail_studentId: {
          userEmail,
          studentId,
        },
      },
    });
    
    if (existingFavorite) {
      // Already favorited, so remove it - using type assertion until Prisma client is regenerated
      await (prisma as any).userFavorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      
      return NextResponse.json({
        isFavorited: false,
        message: "お気に入りから削除しました"
      });
    } else {
      // Not favorited, so add it - using type assertion until Prisma client is regenerated
      await (prisma as any).userFavorite.create({
        data: {
          userEmail,
          studentId,
        },
      });
      
      return NextResponse.json({
        isFavorited: true,
        message: "お気に入りに追加しました"
      });
    }
    
  } catch (error: any) {
    console.error("お気に入り処理エラー:", error);
    return NextResponse.json({ error: "お気に入り処理に失敗しました" }, { status: 500 });
  }
}

// Get all favorites for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // 認証チェック
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    const userEmail = session.user.email;
    
    // Get all favorites for this user - using type assertion until Prisma client is regenerated
    const favorites = await (prisma as any).userFavorite.findMany({
      where: {
        userEmail,
      },
      include: {
        student: true,
      },
    });
    
    return NextResponse.json({
      favorites: favorites.map((f: any) => ({
        id: f.id,
        studentId: f.studentId,
        student: f.student,
      })),
    });
    
  } catch (error: any) {
    console.error("お気に入り取得エラー:", error);
    return NextResponse.json({ error: "お気に入り一覧の取得に失敗しました" }, { status: 500 });
  }
}
