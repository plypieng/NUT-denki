import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";
import { getServerSession } from "next-auth";

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
    
    // 必須フィールドのバリデーション
    if (!data.studentId || !data.fullName || !data.birthDate || !data.hometown || !data.almaMater || !data.targetCourse || !data.year) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }
    
    // 学生データの作成
    const student = await prisma.student.create({
      data: {
        studentId: data.studentId,
        fullName: data.fullName,
        imageUrl: data.imageUrl,
        birthDate: new Date(data.birthDate),
        starSign: data.starSign,
        hometown: data.hometown,
        almaMater: data.almaMater,
        kosenDepartment: data.kosenDepartment,
        kosenThesis: data.kosenThesis,
        mbti: data.mbti,
        hobby: data.hobby,
        circle: data.circle,
        year: data.year,
        lineUrl: data.lineUrl,
        instagramUrl: data.instagramUrl,
        xUrl: data.xUrl,
        likes: data.likes,
        dislikes: data.dislikes,
        goodSubjects: data.goodSubjects,
        targetCourse: data.targetCourse,
        etcNote: data.etcNote,
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
    
    // 必須フィールドのバリデーション
    if (!data.studentId || !data.fullName || !data.birthDate || !data.hometown || !data.almaMater || !data.targetCourse || !data.year) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }
    
    // 更新データの準備
    const updateData: any = {
      studentId: data.studentId,
      fullName: data.fullName,
      imageUrl: data.imageUrl,
      hobbies: data.hobby,
      circle: data.circle,
      year: data.year,
    };
    
    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate);
    }
    
    if (data.starSign) {
      updateData.starSign = data.starSign;
    }
    
    if (data.almaMater) {
      updateData.almaMater = data.almaMater;
    }
    
    if (data.targetCourse) {
      updateData.targetCourse = data.targetCourse;
    }
    
    // Optional fields
    if (data.kosenDepartment !== undefined) updateData.kosenDepartment = data.kosenDepartment;
    if (data.kosenThesis !== undefined) updateData.kosenThesis = data.kosenThesis;
    if (data.mbti !== undefined) updateData.mbti = data.mbti;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.hobby !== undefined) updateData.hobby = data.hobby;
    if (data.circle !== undefined) updateData.circle = data.circle;
    if (data.likes !== undefined) updateData.likes = data.likes;
    if (data.dislikes !== undefined) updateData.dislikes = data.dislikes;
    if (data.goodSubjects !== undefined) updateData.goodSubjects = data.goodSubjects;
    if (data.lineUrl !== undefined) updateData.lineUrl = data.lineUrl;
    if (data.instagramUrl !== undefined) updateData.instagramUrl = data.instagramUrl;
    if (data.xUrl !== undefined) updateData.xUrl = data.xUrl;
    if (data.etcNote !== undefined) updateData.etcNote = data.etcNote;
    
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
