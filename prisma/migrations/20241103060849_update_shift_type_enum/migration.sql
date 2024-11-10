/*
  Warnings:

  - The values [SOBA,OTAIBA] on the enum `ShiftType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ShiftType_new" AS ENUM ('KIBOUKINMU', 'KIBOUKYU', 'KINMU', 'KYUJITSU', 'SAWABANCHUUSHOKU', 'SOJI_TOUTAN', 'KENSHOKUTOUTAN');
ALTER TABLE "Shift" ALTER COLUMN "type" TYPE "ShiftType_new" USING ("type"::text::"ShiftType_new");
ALTER TYPE "ShiftType" RENAME TO "ShiftType_old";
ALTER TYPE "ShiftType_new" RENAME TO "ShiftType";
DROP TYPE "ShiftType_old";
COMMIT;
