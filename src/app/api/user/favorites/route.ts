import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma-client";
import { rateLimit } from "@/lib/rate-limit";

// Get user's favorites
export async function GET(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimitResponse = rateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession();

    // Authentication check
    if (!session?.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // Get user's favorites
    const favorites = await (prisma as any).userFavorite.findMany({
      where: { userEmail: session.user.email },
      select: {
        studentId: true,
      },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("お気に入り取得エラー:", error);
    return NextResponse.json({ error: "お気に入りの取得に失敗しました" }, { status: 500 });
  }
}