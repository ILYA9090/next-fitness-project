/*
  Warnings:

  - You are about to drop the column `entityId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `Favorite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,exerciseId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,programId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,mealId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,coachingId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,supplementId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "favorite_coaching_id_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "favorite_exercise_id_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "favorite_meal_id_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "favorite_program_id_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "favorite_supplement_id_fkey";

-- DropIndex
DROP INDEX "Favorite_userId_entityType_entityId_key";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "entityId",
DROP COLUMN "entityType",
ADD COLUMN     "coachingId" INTEGER,
ADD COLUMN     "exerciseId" INTEGER,
ADD COLUMN     "mealId" INTEGER,
ADD COLUMN     "programId" INTEGER,
ADD COLUMN     "supplementId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_exerciseId_key" ON "Favorite"("userId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_programId_key" ON "Favorite"("userId", "programId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_mealId_key" ON "Favorite"("userId", "mealId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_coachingId_key" ON "Favorite"("userId", "coachingId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_supplementId_key" ON "Favorite"("userId", "supplementId");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_coachingId_fkey" FOREIGN KEY ("coachingId") REFERENCES "Coaching"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_supplementId_fkey" FOREIGN KEY ("supplementId") REFERENCES "Supplement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
