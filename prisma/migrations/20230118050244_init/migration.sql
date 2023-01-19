-- CreateTable
CREATE TABLE "organization" (
    "id" SERIAL NOT NULL,
    "BIN" TEXT NOT NULL,
    "name_org" TEXT NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kassa" (
    "id" SERIAL NOT NULL,
    "snumber" TEXT NOT NULL,
    "znumber" TEXT NOT NULL,
    "knumber" TEXT NOT NULL,
    "name_kassa" TEXT NOT NULL,
    "id_organization" INTEGER NOT NULL,

    CONSTRAINT "kassa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "onlineFiscalNumber" TEXT,
    "offlineFiscalNumber" TEXT,
    "systemDate" TIMESTAMP(3),
    "operationDate" TIMESTAMP(3),
    "type_operation" INTEGER NOT NULL,
    "subType" INTEGER,
    "sum_operation" DECIMAL(65,30),
    "availableSum" DECIMAL(65,30),
    "paymentTypes" TEXT,
    "shift" INTEGER NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL,
    "id_organization" INTEGER NOT NULL,
    "id_kassa" INTEGER NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telegram_users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_BIN_key" ON "organization"("BIN");

-- CreateIndex
CREATE UNIQUE INDEX "kassa_snumber_key" ON "kassa"("snumber");

-- CreateIndex
CREATE UNIQUE INDEX "kassa_knumber_key" ON "kassa"("knumber");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_users_id_key" ON "telegram_users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "kassa" ADD CONSTRAINT "kassa_id_organization_fkey" FOREIGN KEY ("id_organization") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_id_organization_fkey" FOREIGN KEY ("id_organization") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_id_kassa_fkey" FOREIGN KEY ("id_kassa") REFERENCES "kassa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
