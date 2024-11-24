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
CREATE TABLE "JA030_User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" TEXT DEFAULT 'offline',
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JA030_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JA030_Token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JA030_Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JA030_SessionSocket" (
    "id" SERIAL NOT NULL,
    "socketId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JA030_SessionSocket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JA030_User_username_key" ON "JA030_User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "JA030_Token_token_key" ON "JA030_Token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "JA030_SessionSocket_socketId_key" ON "JA030_SessionSocket"("socketId");

-- AddForeignKey
ALTER TABLE "JA030_Token" ADD CONSTRAINT "JA030_Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "JA030_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JA030_SessionSocket" ADD CONSTRAINT "JA030_SessionSocket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "JA030_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
