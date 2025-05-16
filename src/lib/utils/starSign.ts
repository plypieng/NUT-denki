/**
 * 生年月日から星座を計算するユーティリティ
 * @param date 生年月日
 * @returns 星座（日本語）
 */
function getStarSign(date: Date): string {
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

// TypeScript用
export { getStarSign };
