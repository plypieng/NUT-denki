// Prismaスキーマの型定義

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

// CommonJSとES modulesの両方で使えるようにする
type SpecialtyType = typeof Specialty[keyof typeof Specialty];

// TypeScript用
export { Specialty, SpecialtyLabels };
export type { SpecialtyType };
