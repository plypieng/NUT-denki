const { PrismaClient } = require('../src/generated/prisma');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const prisma = new PrismaClient();

// 専攻コースの定義
const Specialty = {
  電気電子情報工学コース: '電気電子情報工学コース',
  機械システム工学コース: '機械システム工学コース',
  物質材料工学コース: '物質材料工学コース'
};

/**
 * 生年月日から星座を計算するユーティリティ
 * @param date 生年月日
 * @returns 星座（日本語）
 */
function getStarSign(date) {
  const month = date.getMonth() + 1; // JavaScriptの月は0から始まるため+1
  const day = date.getDate();

  // 星座の判定
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "水瓶座"; // Aquarius
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return "魚座"; // Pisces
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "牡羊座"; // Aries
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "牡牛座"; // Taurus
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return "双子座"; // Gemini
  } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return "蟹座"; // Cancer
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "獅子座"; // Leo
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "乙女座"; // Virgo
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
    return "天秤座"; // Libra
  } else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
    return "蠍座"; // Scorpio
  } else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
    return "射手座"; // Sagittarius
  } else {
    return "山羊座"; // Capricorn
  }
}

/**
 * CSVファイルから学生データをインポートしてデータベースにシードする
 * usage: node prisma/seed-cjs.js
 */
async function main() {
  console.log('シード処理を開始します...');

  try {
    // CSVファイルの存在を確認
    const csvPath = path.join(__dirname, 'students.csv');
    if (!fs.existsSync(csvPath)) {
      console.error('CSVファイルが見つかりません:', csvPath);
      console.log('以下の形式のCSVファイルを作成して再実行してください:');
      console.log('fullName,studentId,birthDate,hometown,almaMater,targetCourse');
      return;
    }

    // CSVファイルを読み込む
    const csvData = fs.readFileSync(csvPath, 'utf8');
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`${records.length}件の学生データを処理します...`);

    // バルクインサートの代わりにループで処理（エラーを個別に処理するため）
    let successCount = 0;
    let errorCount = 0;

    for (const record of records) {
      try {
        // 必須フィールドの存在確認
        if (!record.fullName || !record.studentId) {
          console.error('不正なレコード（氏名または学籍番号が空）:', record);
          errorCount++;
          continue;
        }

        // 生年月日をパース
        let birthDate = new Date();
        let starSign = null;
        
        if (record.birthDate) {
          birthDate = new Date(record.birthDate);
          if (isNaN(birthDate.getTime())) {
            // デフォルトの生年月日を使用
            birthDate = new Date(2000, 0, 1); // 2000年1月1日
          }
          // 星座を計算
          starSign = getStarSign(birthDate);
        }

        // 専攻コースのバリデーション
        let targetCourse = Specialty.電気電子情報工学コース;
        if (record.targetCourse) {
          // 文字列からSpecialty enumへの変換を試みる
          if (Object.values(Specialty).includes(record.targetCourse)) {
            targetCourse = record.targetCourse;
          }
        }

        // 学生レコードを作成または更新
        await prisma.student.upsert({
          where: { studentId: record.studentId },
          update: {
            fullName: record.fullName,
            birthDate,
            starSign,
            hometown: record.hometown || '不明',
            almaMater: record.almaMater || '不明',
            targetCourse,
            kosenDepartment: record.kosenDepartment || null,
            kosenThesis: record.kosenThesis || null,
            mbti: record.mbti || null,
            hobby: record.hobby || null,
            circle: record.circle || null,
            likes: record.likes || null,
            dislikes: record.dislikes || null,
            goodSubjects: record.goodSubjects || null,
            etcNote: record.etcNote || null,
          },
          create: {
            studentId: record.studentId,
            fullName: record.fullName,
            birthDate,
            starSign,
            hometown: record.hometown || '不明',
            almaMater: record.almaMater || '不明',
            targetCourse,
            kosenDepartment: record.kosenDepartment || null,
            kosenThesis: record.kosenThesis || null,
            mbti: record.mbti || null,
            hobby: record.hobby || null,
            circle: record.circle || null,
            likes: record.likes || null,
            dislikes: record.dislikes || null,
            goodSubjects: record.goodSubjects || null,
            etcNote: record.etcNote || null,
          },
        });

        successCount++;
      } catch (error) {
        console.error('レコードの処理中にエラーが発生しました:', record, error);
        errorCount++;
      }
    }

    console.log(`シード処理が完了しました: ${successCount}件成功, ${errorCount}件失敗`);
  } catch (error) {
    console.error('シード処理中にエラーが発生しました:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
