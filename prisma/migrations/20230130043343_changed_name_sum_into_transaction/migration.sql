/*
  Warnings:

  - You are about to drop the column `sum_operation` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "sum_operation",
ADD COLUMN     "sum" DECIMAL(65,30);
