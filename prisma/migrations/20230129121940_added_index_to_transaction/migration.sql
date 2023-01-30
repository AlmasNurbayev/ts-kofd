-- DropIndex
DROP INDEX "transaction_shift_id_kassa_idx";

-- CreateIndex
CREATE INDEX "transaction_shift_id_kassa_operationDate_idx" ON "transaction"("shift", "id_kassa", "operationDate");
