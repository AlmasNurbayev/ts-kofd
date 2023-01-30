/*
  Warnings:

  - You are about to drop the column `type_operation` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `type` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "type_operation",
ADD COLUMN     "type" INTEGER NOT NULL;
