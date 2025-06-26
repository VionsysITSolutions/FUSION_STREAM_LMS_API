-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'blocked');

-- DropForeignKey
ALTER TABLE "batch_module" DROP CONSTRAINT "batch_module_instructorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'active';
