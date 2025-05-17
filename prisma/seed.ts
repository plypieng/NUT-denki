const { PrismaClient } = require('@prisma/client');
const { Specialty } = require('../src/types/schema');
const fs = require('fs');
const path = require('path');
const { getStarSign } = require('../src/lib/utils/starSign');

const prisma = new PrismaClient();

/**
 * テスト用の学生データを作成してデータベースにシードする
 * usage: npx prisma db seed
 */
async function main() {
  console.log('シード処理を開始します...');

  try {
    // 既存のデータを削除（リセット）
    console.log('既存の学生データを削除しています...');
    await prisma.student.deleteMany({});
    console.log('既存の学生データを削除しました。');
    
    // テスト用の学生データ
    const testStudents = [
      {
        fullName: 'TEST 山田 太郎',
        studentId: '25314986',
        birthDate: new Date(2000, 4, 15), // 2000年5月15日
        hometown: '東京都',
        almaMater: '長岡高専',
        kosenDepartment: '電気電子システム工学科',
        kosenThesis: 'IoTデバイスの省電力化研究',
        mbti: 'INTJ',
        hobby: 'プログラミング',
        circle: 'ロボット研究会',
        likes: 'コーヒー',
        dislikes: '早起き',
        goodSubjects: '数学',
        targetCourse: Specialty.DENKI_ENERGY_CONTROL,
        year: 'B3',
        etcNote: 'テスト用データです',
      },
      {
        fullName: 'TEST 鈴木 花子',
        studentId: '25321686',
        birthDate: new Date(2001, 7, 22), // 2001年8月22日
        hometown: '新潟県',
        almaMater: '長岡富士高校',
        mbti: 'ENFP',
        hobby: '写真撮影',
        circle: '写真部',
        likes: '韓国料理',
        goodSubjects: '英語',
        targetCourse: Specialty.DENSHI_DEVICE_OPTICAL,
        year: 'B2',
      },
      {
        fullName: 'TEST 田中 学',
        studentId: '25333386',
        birthDate: new Date(1999, 11, 3), // 1999年12月3日
        hometown: '福島県',
        almaMater: '福島高専',
        kosenDepartment: '情報工学科',
        kosenThesis: '自然言語処理による感情分析',
        hobby: 'ゲーム開発',
        circle: 'プログラミング同好会',
        likes: 'ゲーム',
        dislikes: '運動',
        goodSubjects: '情報処理',
        targetCourse: Specialty.JOHO_COMMUNICATION,
        year: 'B4',
      }
    ];

    console.log(`テスト用学生データ ${testStudents.length}件を作成します...`);
    
    // フルリセットを行うためにユーザーテーブルもリセット
    console.log('全テーブルのリセットを行います...');
    await prisma.account.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('ユーザー関連テーブルをリセットしました。');

    // 学生データをデータベースに保存
    let successCount = 0;
    let errorCount = 0;

    for (const student of testStudents) {
      try {
        // 星座を計算する
        const starSign = student.birthDate ? getStarSign(student.birthDate) : null;

        // 学生レコードを作成
        await prisma.student.create({
          data: {
            studentId: student.studentId,
            fullName: student.fullName,
            birthDate: student.birthDate,
            starSign: starSign,
            hometown: student.hometown,
            almaMater: student.almaMater,
            targetCourse: student.targetCourse,
            kosenDepartment: student.kosenDepartment || null,
            kosenThesis: student.kosenThesis || null,
            mbti: student.mbti || null,
            hobby: student.hobby || null,
            circle: student.circle || null,
            lineUrl: null,
            instagramUrl: null,
            xUrl: null,
            likes: student.likes || null,
            dislikes: student.dislikes || null,
            goodSubjects: student.goodSubjects || null,
            year: student.year || 'B1',
            etcNote: student.etcNote || null,
          },
        });
        successCount++;
        console.log(`学生データを追加しました: ${student.fullName} (${student.studentId})`);
      } catch (error) {
        console.error(`学生データの保存に失敗しました (${student.studentId})`, error);
        errorCount++;
      }
    }

    // 結果の報告
    console.log(`シード処理完了: 成功=${successCount}, 失敗=${errorCount}`);
  } catch (error) {
    console.error('シード処理中にエラーが発生しました:', error);
    throw error;
  }
}

// シードスクリプトの実行
main()
  .catch((e) => {
    console.error('シード処理中にエラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    // 接続を閉じる
    await prisma.$disconnect();
  });
