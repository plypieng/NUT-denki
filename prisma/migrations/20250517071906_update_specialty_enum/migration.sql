/*
  Warnings:

  - The values [電気電子情報工学コース,機械システム工学コース,物質材料工学コース] on the enum `Specialty` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Specialty_new" AS ENUM ('DENKI_ENERGY_CONTROL', 'DENSHI_DEVICE_OPTICAL', 'JOHO_COMMUNICATION', 'KIKAI_SYSTEM', 'BUSSHITSU_MATERIALS');
ALTER TABLE "Student" ALTER COLUMN "targetCourse" TYPE "Specialty_new" USING ("targetCourse"::text::"Specialty_new");
ALTER TYPE "Specialty" RENAME TO "Specialty_old";
ALTER TYPE "Specialty_new" RENAME TO "Specialty";
DROP TYPE "Specialty_old";
COMMIT;
