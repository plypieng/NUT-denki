-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Specialty" ADD VALUE '電気電子情報工学コース';
ALTER TYPE "Specialty" ADD VALUE '機械システム工学コース';
ALTER TYPE "Specialty" ADD VALUE '物質材料工学コース';

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "ownerEmail" TEXT;
