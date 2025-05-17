import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma-client";
import { getServerSession } from "next-auth";

// 特定の学生情報を取得するAPIエンドポイント
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    
    // 認証チェック
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    const { id } = await params;
    
    // 学生データの取得
    const student = await prisma.student.findUnique({
      where: { id },
    });
    
    if (!student) {
      return NextResponse.json({ error: "学生が見つかりません" }, { status: 404 });
    }
    
    return NextResponse.json(student);
  } catch (error) {
    console.error("学生取得エラー:", error);
    return NextResponse.json({ error: "学生の取得に失敗しました" }, { status: 500 });
  }
}

// 学生情報を更新するAPIエンドポイント
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    
    // 認証チェック
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    // 管理者かどうかのチェック
    const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;
    
    const { id } = await params;
    
    // ユーザーの権限チェック - 管理者または自分のプロフィールのみ編集可能
    if (!isAdmin) {
      // 自分のプロフィールかどうかをチェック
      const student = await prisma.student.findUnique({
        where: { id },
      });
      
      if (!student) {
        return NextResponse.json({ error: "学生が見つかりません" }, { status: 404 });
      }
      
      // メールアドレスから学生IDの基本部分を導出して比較
      const emailUsername = session.user?.email?.split('@')[0] || '';
      
      // 学生IDの基本部分を比較: s253149 -> 学生IDが"253149XX"という形式かチェック
      if (emailUsername.startsWith('s') && emailUsername.length >= 7) {
        const baseStudentId = emailUsername.substring(1);
        
        // 学生IDがメールアドレスから導出した基本部分で始まるかチェック
        if (!student.studentId.startsWith(baseStudentId)) {
          return NextResponse.json({ error: "自分のプロフィールのみ編集できます" }, { status: 403 });
        }
      } else {
        return NextResponse.json({ error: "有効なメールアドレスではありません" }, { status: 403 });
      }
    }
    
    const data = await request.json();
    
    // 学生の存在チェック
    const existingStudent = await prisma.student.findUnique({
      where: { id },
    });
    
    if (!existingStudent) {
      return NextResponse.json({ error: "学生が見つかりません" }, { status: 404 });
    }
    
    // 更新データの準備（birthDateがある場合はDate型に変換）
    const updateData = { ...data };
    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate);
    }
    
    // 学生データの更新
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(updatedStudent);
  } catch (error: any) {
    console.error("学生更新エラー:", error);
    
    // 一意制約エラーの処理
    if (error.code === "P2002") {
      return NextResponse.json({ error: "この学籍番号は既に登録されています" }, { status: 409 });
    }
    
    return NextResponse.json({ error: "学生の更新に失敗しました" }, { status: 500 });
  }
}

// 学生情報を削除するAPIエンドポイント
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    
    // 認証チェック
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    
    // 管理者かどうかのチェック
    const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;
    
    const { id } = await params;
    console.log('API DELETE request for student id:', id);
    
    // 学生の存在チェック
    const existingStudent = await prisma.student.findUnique({
      where: { id },
    });
    
    if (!existingStudent) {
      return NextResponse.json({ error: "学生が見つかりません" }, { status: 404 });
    }
    
    // ユーザーの権限チェック - 管理者または自分のプロフィールのみ削除可能
    if (!isAdmin) {
      // メールアドレスから学生IDの基本部分を導出して比較
      const emailUsername = session.user?.email?.split('@')[0] || '';
      
      // 学生IDの基本部分を比較: s253149 -> 学生IDが"253149XX"という形式かチェック
      if (emailUsername.startsWith('s') && emailUsername.length >= 7) {
        const baseStudentId = emailUsername.substring(1);
        
        // 学生IDがメールアドレスから導出した基本部分で始まるかチェック
        if (!existingStudent.studentId.startsWith(baseStudentId)) {
          return NextResponse.json({ error: "自分のプロフィールのみ削除できます" }, { status: 403 });
        }
      } else {
        return NextResponse.json({ error: "有効なメールアドレスではありません" }, { status: 403 });
      }
    }
    
    // 学生データの削除
    await prisma.student.delete({
      where: { id },
    });
    console.log('API DELETE succeeded for student id:', id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("学生削除エラー:", error);
    return NextResponse.json({ error: "学生の削除に失敗しました" }, { status: 500 });
  }
}
