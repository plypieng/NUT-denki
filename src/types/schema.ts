// Prismaスキーマの型定義

// TypeScriptとCommonJSの両方で動作するように定義
const Specialty = {
  電気電子情報工学コース: '電気電子情報工学コース',
  機械システム工学コース: '機械システム工学コース',
  物質材料工学コース: '物質材料工学コース'
} as const;

// CommonJSとES modulesの両方で使えるようにする
type SpecialtyType = typeof Specialty[keyof typeof Specialty];

// TypeScript用
export { Specialty };
export type { SpecialtyType };
