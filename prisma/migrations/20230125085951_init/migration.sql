-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" TEXT,
ALTER COLUMN "salt" DROP NOT NULL;
