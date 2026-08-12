-- CreateTable
CREATE TABLE "MuscleGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MuscleGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExerciseToMuscleGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ExerciseToMuscleGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "MuscleGroup_slug_key" ON "MuscleGroup"("slug");

-- CreateIndex
CREATE INDEX "_ExerciseToMuscleGroup_B_index" ON "_ExerciseToMuscleGroup"("B");

-- AddForeignKey
ALTER TABLE "_ExerciseToMuscleGroup" ADD CONSTRAINT "_ExerciseToMuscleGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToMuscleGroup" ADD CONSTRAINT "_ExerciseToMuscleGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "MuscleGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
