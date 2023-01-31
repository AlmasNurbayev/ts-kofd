-- CreateTable
CREATE TABLE "token_kofd" (
    "id" SERIAL NOT NULL,
    "BIN" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "exp" INTEGER NOT NULL,
    "nbf" INTEGER NOT NULL,
    "working" BOOLEAN NOT NULL,

    CONSTRAINT "token_kofd_pkey" PRIMARY KEY ("id")
);
