/*
  Warnings:

  - You are about to drop the `SessionSocket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SessionSocket" DROP CONSTRAINT "SessionSocket_userId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- DropTable
DROP TABLE "SessionSocket";

-- DropTable
DROP TABLE "Token";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "UserDB" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" TEXT DEFAULT 'offline',
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenDb" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenDb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionSocketDb" (
    "id" SERIAL NOT NULL,
    "socketId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionSocketDb_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDB_username_key" ON "UserDB"("username");

-- CreateIndex
CREATE UNIQUE INDEX "TokenDb_token_key" ON "TokenDb"("token");

-- CreateIndex
CREATE UNIQUE INDEX "SessionSocketDb_socketId_key" ON "SessionSocketDb"("socketId");

-- AddForeignKey
ALTER TABLE "TokenDb" ADD CONSTRAINT "TokenDb_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserDB"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionSocketDb" ADD CONSTRAINT "SessionSocketDb_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserDB"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
