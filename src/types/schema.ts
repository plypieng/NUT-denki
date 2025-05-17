// Prismaスキーマの型定義

// 専攜分野の定義
const Department = {
  DENKI: 'DENKI', // 電気電子情報工学分野
  KIKAI: 'KIKAI', // 機械工学分野
  JOHO_KEIEI: 'JOHO_KEIEI', // 情報・経営システム工学分野
  BUSSHITSU_SEIBUTSU: 'BUSSHITSU_SEIBUTSU', // 物質生物工学分野
  KANKYO_SHAKAI: 'KANKYO_SHAKAI', // 環境社会基盤工学分野
  RYOSHI_GENSHIRYOKU: 'RYOSHI_GENSHIRYOKU', // 量子・原子力統合工学分野
  SYSTEM_SAFETY: 'SYSTEM_SAFETY', // システム安全工学分野
} as const;

// 専攜分野の表示用ラベル
const DepartmentLabels = {
  [Department.DENKI]: '電気電子情報工学分野',
  [Department.KIKAI]: '機械工学分野',
  [Department.JOHO_KEIEI]: '情報・経営システム工学分野',
  [Department.BUSSHITSU_SEIBUTSU]: '物質生物工学分野',
  [Department.KANKYO_SHAKAI]: '環境社会基盤工学分野',
  [Department.RYOSHI_GENSHIRYOKU]: '量子・原子力統合工学分野',
  [Department.SYSTEM_SAFETY]: 'システム安全工学分野',
} as const;

// 専攜分野のカラーコード
// ヘッダー画像の色に合わせた色定義
const DepartmentColors = {
  [Department.DENKI]: 'border-pink-500 border-opacity-100 dark:border-pink-400',           // 電気電子情報工学分野 - ピンク
  [Department.KIKAI]: 'border-indigo-500 border-opacity-100 dark:border-indigo-400',     // 機械工学分野 - 藍
  [Department.JOHO_KEIEI]: 'border-orange-500 border-opacity-100 dark:border-orange-400', // 情報経営システム工学分野 - オレンジ
  [Department.BUSSHITSU_SEIBUTSU]: 'border-amber-500 border-opacity-100 dark:border-amber-400', // 物質生物工学分野 - 黄色
  [Department.KANKYO_SHAKAI]: 'border-lime-500 border-opacity-100 dark:border-lime-400',     // 環境社会基盤工学分野 - 薄緑
  [Department.RYOSHI_GENSHIRYOKU]: 'border-green-500 border-opacity-100 dark:border-green-400', // 量子原子力統合工学分野 - 濃緑
  [Department.SYSTEM_SAFETY]: 'border-blue-500 border-opacity-100 dark:border-blue-400',     // システム安全工学分野 - 青
  'DEFAULT': 'border-gray-500 border-opacity-100 dark:border-gray-400',              // デフォルト色 (分野未指定時)
} as const;

// TypeScriptとCommonJSの両方で動作するように定義
const Specialty = {
  // 旧コース名（既存データとの互換性のために残す）
  電気電子情報工学コース: '電気電子情報工学コース',
  機械システム工学コース: '機械システム工学コース',
  物質材料工学コース: '物質材料工学コース',
  
  // 電気電子情報工学分野の専門コース（新コース名）
  DENKI_ENERGY_CONTROL: 'DENKI_ENERGY_CONTROL',
  DENSHI_DEVICE_OPTICAL: 'DENSHI_DEVICE_OPTICAL',
  JOHO_COMMUNICATION: 'JOHO_COMMUNICATION',
  
  // 他の分野のコース（新コース名）
  KIKAI_SYSTEM: 'KIKAI_SYSTEM',
  BUSSHITSU_MATERIALS: 'BUSSHITSU_MATERIALS'
} as const;

// 表示用の名称マッピング
const SpecialtyLabels = {
  // 旧コース名の表示
  [Specialty.電気電子情報工学コース]: '電気電子情報工学コース',
  [Specialty.機械システム工学コース]: '機械システム工学コース',
  [Specialty.物質材料工学コース]: '物質材料工学コース',
  
  // 新コース名の表示
  [Specialty.DENKI_ENERGY_CONTROL]: '電気エネルギー・制御工学',
  [Specialty.DENSHI_DEVICE_OPTICAL]: '電子デバイス・光波制御工学',
  [Specialty.JOHO_COMMUNICATION]: '情報通信制御工学',
  [Specialty.KIKAI_SYSTEM]: '機械システム工学コース',
  [Specialty.BUSSHITSU_MATERIALS]: '物質材料工学コース'
} as const;

// 専門コースと専攜分野のマッピング
const SpecialtyToDepartment = {
  [Specialty.DENKI_ENERGY_CONTROL]: Department.DENKI,
  [Specialty.DENSHI_DEVICE_OPTICAL]: Department.DENKI,
  [Specialty.JOHO_COMMUNICATION]: Department.DENKI,
  [Specialty.KIKAI_SYSTEM]: Department.KIKAI,
  [Specialty.BUSSHITSU_MATERIALS]: Department.BUSSHITSU_SEIBUTSU,
  
  // 旧コース名のマッピング
  [Specialty.電気電子情報工学コース]: Department.DENKI,
  [Specialty.機械システム工学コース]: Department.KIKAI,
  [Specialty.物質材料工学コース]: Department.BUSSHITSU_SEIBUTSU
} as const;

// CommonJSとES modulesの両方で使えるようにする
type SpecialtyType = typeof Specialty[keyof typeof Specialty];
type DepartmentType = typeof Department[keyof typeof Department];

// 専門コースと専攜分野を結合した表示用のフォーマッタ関数
const formatCourseWithDepartment = (specialty: SpecialtyType, includeYear: boolean = false, year: string = '') => {
  // 専攜分野を取得
  const department = SpecialtyToDepartment[specialty as keyof typeof SpecialtyToDepartment];
  if (!department) return SpecialtyLabels[specialty as keyof typeof SpecialtyLabels] || specialty;
  
  // 専攜分野と専門コースの表示用文字列を取得
  const departmentLabel = DepartmentLabels[department];
  const specialtyLabel = SpecialtyLabels[specialty as keyof typeof SpecialtyLabels] || specialty;
  
  // 学年を含める場合
  if (includeYear && year) {
    return `${departmentLabel} (${specialtyLabel}) ${year}`;
  }
  
  // 専攜分野と専門コースを結合した文字列を返す
  return `${departmentLabel} (${specialtyLabel})`;
};

// TypeScript用
export { Specialty, SpecialtyLabels, Department, DepartmentLabels, DepartmentColors, SpecialtyToDepartment, formatCourseWithDepartment };
export type { SpecialtyType, DepartmentType };
