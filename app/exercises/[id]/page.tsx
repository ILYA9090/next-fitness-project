import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ExercisePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { id } = await params;
  const exercise = await prisma.exercise.findUnique({
    where: { id: Number(id) },
    include: {
      muscleGroups: true,
      category: true,
      _count: {
        select: { favorites: true },
      },
    },
  });

  if (!exercise) {
    notFound();
  }

  return (
    <Container className="py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition mb-6"
      >
        <ArrowLeft size={18} />
        Назад в каталог
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-2xl aspect-video flex items-center justify-center">
          {exercise.videoUrl ? (
            <video
              src={exercise.videoUrl}
              controls
              className="w-full h-full rounded-2xl object-cover"
            />
          ) : (
            <div className="text-6xl">🏋️</div>
          )}
        </div>

        <div>
          <Title text={exercise.name} size="lg" className="font-extrabold" />
          <p className="text-gray-500 mt-2">
            Категория: {exercise.category?.name}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {exercise.muscleGroups.map((mg) => (
              <span
                key={mg.id}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {mg.name}
              </span>
            ))}
          </div>

          {exercise.description && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg">Описание</h3>
              <p className="text-gray-600 mt-2 leading-relaxed">
                {exercise.description}
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm text-gray-500">⭐ в избранном</span>
          </div>
        </div>
      </div>
    </Container>
  );
}

export async function generateMetadata({ params }: ExercisePageProps) {
  const { id } = await params;

  const exercise = await prisma.exercise.findUnique({
    where: { id: Number(id) },
  });

  if (!exercise) {
    return { title: "Упражнение не найдено" };
  }

  return {
    title: `${exercise.name} - Ваш фитнес портал`,
    description: exercise.description,
  };
}
