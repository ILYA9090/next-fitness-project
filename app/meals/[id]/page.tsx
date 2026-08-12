import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MealPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MealPage({ params }: MealPageProps) {
  const { id } = await params;
  const meal = await prisma.meal.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      _count: {
        select: { favorites: true },
      },
    },
  });

  if (!meal) {
    notFound();
  }

  const mealTypeMap: Record<string, { label: string; emoji: string }> = {
    breakfast: { label: "Завтрак", emoji: "🌅" },
    lunch: { label: "Обед", emoji: "☀️" },
    dinner: { label: "Ужин", emoji: "🌙" },
    snack: { label: "Перекус", emoji: "🍿" },
  };

  const typeInfo = mealTypeMap[meal.mealType] || {
    label: meal.mealType,
    emoji: "🍽️",
  };

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
        <div className="flex items-center gap-3">
          <span className="text-4xl">{typeInfo.emoji}</span>
          <Title text={meal.name} size="lg" className="font-extrabold" />
        </div>

        <p className="text-gray-500 mt-2">
          Категория: {meal.category?.name} • {typeInfo.label}
        </p>

        {meal.calories && (
          <div className="mt-4 inline-block bg-orange-50 px-4 py-2 rounded-xl">
            <span className="text-2xl font-bold text-orange-600">
              {meal.calories}
            </span>
            <span className="text-gray-500 ml-1">ккал</span>
          </div>
        )}

        {meal.description && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600 leading-relaxed">{meal.description}</p>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          ⭐ {meal._count.favorites} в избранном
        </div>
      </div>
    </Container>
  );
}
