import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";
import { getServerSession } from "next-auth";
import { Specialty } from "@/types/schema";

// 学生一覧を取得するAPIエンドポイント（ページネーション、検索、フィルタリング対応）
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // 認証チェック
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    // URLパラメータの取得
    const searchParams = request.nextUrl.searchParams;
    
    // ページネーション
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;
    
    // 検索とフィルタリング
    const search = searchParams.get("q") || "";
    const course = searchParams.get("course");
    const circle = searchParams.get("circle");
    
    // フィルターの条件を構築
    const filter: any = {};
    
    if (course) {
      filter.targetCourse = course;
    }
    
    if (circle) {
      filter.circle = {
        contains: circle,
      };
    }
    
    if (search) {
      filter.OR = [
        { fullName: { contains: search } },
        { studentId: { contains: search } },
        { hometown: { contains: search } },
        { almaMater: { contains: search } },
        { hobby: { contains: search } },
      ];
    }
    
    // データベースクエリの実行
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where: filter,
        orderBy: { fullName: "asc" },
        skip,
        take: limit,
        select: {
          id: true,
          studentId: true,
          fullName: true,
          imageUrl: true,
          targetCourse: true,
          circle: true,
        },
      }),
      prisma.student.count({ where: filter }),
    ]);
    
    // レスポンスの生成
    return NextResponse.json({
      students,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("学生一覧の取得エラー:", error);
    return NextResponse.json({ error: "学生一覧の取得に失敗しました" }, { status: 500 });
  }
}

// 新しい学生を追加するAPIエンドポイント
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // 認証チェック
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    // 管理者かどうかチェック
    const isAdmin = session.user.email === process.env.ADMIN_EMAIL;
    
    // Check if user already has a profile
    if (!isAdmin) {
      const existingProfile = await prisma.student.findFirst({
        where: {
          studentId: { contains: session.user.email.split('@')[0] }
        }
      });
      
      if (existingProfile) {
        return NextResponse.json(
          { error: "既にプロフィールを作成済みです。編集のみ可能です。" }, 
          { status: 400 }
        );
      }
    }
    
    // リクエストボディの取得
    const data = await request.json();
    
    // 必須フィールドのバリデーション
    if (!data.studentId || !data.fullName || !data.birthDate || !data.hometown || !data.almaMater || !data.targetCourse || !data.year) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }
    
    // Extract targetCourse from the data to handle it specially
    const { targetCourse, ...otherData } = data;
    
    // If not admin, we'll force the studentId to match their email username
    if (!isAdmin && session.user?.email) {
      const emailUsername = session.user.email.split('@')[0];
      if (!otherData.studentId.includes(emailUsername)) {
        otherData.studentId = emailUsername;
      }
    }
    
    // 学生データの作成
    const student = await prisma.student.create({
      data: {
        studentId: otherData.studentId,
        fullName: otherData.fullName,
        imageUrl: otherData.imageUrl,
        birthDate: new Date(otherData.birthDate),
        starSign: otherData.starSign,
        hometown: otherData.hometown,
        almaMater: otherData.almaMater,
        kosenDepartment: otherData.kosenDepartment,
        kosenThesis: otherData.kosenThesis,
        mbti: otherData.mbti,
        hobby: otherData.hobby,
        circle: otherData.circle,
        year: otherData.year,
        lineUrl: otherData.lineUrl,
        instagramUrl: otherData.instagramUrl,
        xUrl: otherData.xUrl,
        likes: otherData.likes,
        dislikes: otherData.dislikes,
        goodSubjects: otherData.goodSubjects,
        targetCourse: targetCourse as any, // Cast to any to bypass TypeScript checking
        etcNote: otherData.etcNote,
        // Note: We're using studentId to track ownership
        // The studentId will contain the email username for non-admin users
      },
    });
    
    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("学生作成エラー:", error);
    
    // 一意制約エラーの処理
    if (error.code === "P2002") {
      return NextResponse.json({ error: "この学籍番号は既に登録されています" }, { status: 409 });
    }
    
    return NextResponse.json({ error: "学生の作成に失敗しました" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // 認証チェック
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    // 管理者権限チェック
    const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;
    if (!isAdmin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
    }
    
    // リクエストボディの取得
    const data = await request.json();
    // 更新対象のIDを取得
    const { id } = data;

    // 必須フィールドのバリデーション
    if (!id || !data.studentId || !data.fullName || !data.birthDate || !data.hometown || !data.almaMater || !data.year) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }
    
    // First get the current student to preserve the targetCourse
    const currentStudent = await prisma.student.findUnique({
      where: { id },
      select: { targetCourse: true }
    });
    
    if (!currentStudent) {
      return NextResponse.json({ error: "学生が見つかりません" }, { status: 404 });
    }
    
    // 更新データの準備
    // Explicitly remove targetCourse from the updateData to avoid enum validation issues
    const { targetCourse, ...restData } = data;
    
    const updateData: any = {
      studentId: restData.studentId,
      fullName: restData.fullName,
      hometown: restData.hometown,
      year: restData.year,
      birthDate: new Date(restData.birthDate),
      almaMater: restData.almaMater,
      // Use the existing targetCourse from the database to avoid validation issues
      targetCourse: currentStudent.targetCourse,
    };

    if (restData.starSign) {
      updateData.starSign = restData.starSign;
    }

    // Helper function to set fields only if they're defined
    const setIfDefined = (field: string, value: any) => {
      if (value !== undefined) {
        updateData[field] = value === '' ? null : value;
      }
    };
    
    // Handle optional fields
    setIfDefined('imageUrl', restData.imageUrl);
    setIfDefined('kosenDepartment', restData.kosenDepartment);
    setIfDefined('kosenThesis', restData.kosenThesis);
    setIfDefined('mbti', restData.mbti);
    setIfDefined('hobby', restData.hobby);
    setIfDefined('circle', restData.circle);
    setIfDefined('likes', restData.likes);
    setIfDefined('dislikes', restData.dislikes);
    setIfDefined('goodSubjects', restData.goodSubjects);
    setIfDefined('lineUrl', restData.lineUrl);
    setIfDefined('instagramUrl', restData.instagramUrl);
    setIfDefined('xUrl', restData.xUrl);
    setIfDefined('etcNote', restData.etcNote);
    
    // Update student data without changing the targetCourse
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("学生更新エラー:", error);
    return NextResponse.json({ error: "学生の更新に失敗しました" }, { status: 500 });
  }
}
