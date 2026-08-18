import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CoachingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CoachingPage({ params }: CoachingPageProps) {
  const { id } = await params;
  const coaching = await prisma.coaching.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      _count: {
        select: { favorites: true },
      },
    },
  });

  if (!coaching) {
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

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-4xl">👨‍🏫</span>
          <Title text={coaching.name} size="lg" className="font-extrabold" />
        </div>

        <p className="text-gray-500 mt-2">
          Категория: {coaching.category?.name}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {coaching.price && (
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-600">
                {coaching.price} ₽
              </div>
              <div className="text-sm text-gray-500">Стоимость</div>
            </div>
          )}
          {coaching.duration && (
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-600">
                {coaching.duration}
              </div>
              <div className="text-sm text-gray-500">Длительность</div>
            </div>
          )}
        </div>

        {coaching.description && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600 leading-relaxed">
              {coaching.description}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
