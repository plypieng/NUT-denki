-- CreateEnum
CREATE TYPE "Specialty" AS ENUM ('電気電子情報工学コース', '機械システム工学コース', '物質材料工学コース');

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "starSign" TEXT,
    "hometown" TEXT NOT NULL,
    "almaMater" TEXT NOT NULL,
    "kosenDepartment" TEXT,
    "kosenThesis" TEXT,
    "mbti" TEXT,
    "hobby" TEXT,
    "circle" TEXT,
    "likes" TEXT,
    "dislikes" TEXT,
    "goodSubjects" TEXT,
    "targetCourse" "Specialty" NOT NULL,
    "etcNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentId_key" ON "Student"("studentId");
