-- CreateEnum
CREATE TYPE "SolutionRating" AS ENUM ('LIKE', 'PARTIAL', 'DISLIKE');

-- CreateEnum
CREATE TYPE "PurchaseIntent" AS ENUM ('BUY', 'MAYBE', 'NO');

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "solutionName" TEXT NOT NULL,
    "theme" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "voterName" TEXT,
    "solutionRating" "SolutionRating" NOT NULL,
    "purchaseIntent" "PurchaseIntent" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
