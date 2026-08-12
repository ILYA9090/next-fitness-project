-- CreateTable
CREATE TABLE "Supplement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "price" INTEGER,
    "weight" TEXT,
    "flavor" TEXT,
    "brand" TEXT,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Supplement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Supplement" ADD CONSTRAINT "Supplement_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "favorite_exercise_id_fkey" FOREIGN KEY ("entityId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "favorite_program_id_fkey" FOREIGN KEY ("entityId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "favorite_meal_id_fkey" FOREIGN KEY ("entityId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "favorite_coaching_id_fkey" FOREIGN KEY ("entityId") REFERENCES "Coaching"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "favorite_supplement_id_fkey" FOREIGN KEY ("entityId") REFERENCES "Supplement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
