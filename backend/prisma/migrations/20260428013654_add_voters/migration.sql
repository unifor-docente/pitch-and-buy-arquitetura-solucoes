/*
  Warnings:

  - You are about to drop the column `voterName` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teamId,voterId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `voterId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "voterName",
ADD COLUMN     "voterId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Voter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Voter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_teamId_voterId_key" ON "Vote"("teamId", "voterId");

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Voter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
