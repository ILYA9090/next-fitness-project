import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProgramPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { id } = await params;
  const program = await prisma.program.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      exercises: {
        include: {
          exercise: {
            include: {
              muscleGroups: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
      _count: {
        select: { favorites: true },
      },
    },
  });

  if (!program) {
    notFound();
  }

  const totalSets = program.exercises.reduce(
    (acc, pe) => acc + (pe.sets || 0),
    0,
  );
  const totalReps = program.exercises.reduce(
    (acc, pe) => acc + (pe.reps || 0),
    0,
  );

  return (
    <Container className="py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition mb-6"
      >
        <ArrowLeft size={18} />
        Назад в каталог
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <Title text={program.name} size="lg" className="font-extrabold" />
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            {program.level === "easy" && "🟢 Лёгкий"}
            {program.level === "medium" && "🟡 Средний"}
            {program.level === "hard" && "🔴 Сложный"}
          </span>
        </div>

        <p className="text-gray-500 mt-2">
          Категория: {program.category?.name}
        </p>

        {program.description && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600 leading-relaxed">
              {program.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-600">
              {program.weeks || "?"}
            </div>
            <div className="text-sm text-gray-500">Недель</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-green-600">
              {program.exercises.length}
            </div>
            <div className="text-sm text-gray-500">Упражнений</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalSets}
            </div>
            <div className="text-sm text-gray-500">Всего подходов</div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-4">
            📋 Упражнения программы
          </h3>
          <div className="space-y-3">
            {program.exercises.map((pe, index) => (
              <div
                key={pe.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400 font-mono w-6">
                    {index + 1}.
                  </span>
                  <div>
                    <Link
                      href={`/exercises/${pe.exercise.id}`}
                      className="font-medium hover:text-blue-600 transition"
                    >
                      {pe.exercise.name}
                    </Link>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {pe.exercise.muscleGroups.slice(0, 3).map((mg) => (
                        <span
                          key={mg.id}
                          className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded"
                        >
                          {mg.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  <div>{pe.sets || "—"} подходов</div>
                  <div>{pe.reps || "—"} повторений</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">⭐ в избранном</div>
      </div>
    </Container>
  );
}
