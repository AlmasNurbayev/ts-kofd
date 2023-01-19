-- CreateIndex
CREATE INDEX "kassa_id_idx" ON "kassa"("id");

-- CreateIndex
CREATE INDEX "transaction_shift_id_kassa_idx" ON "transaction"("shift", "id_kassa");
