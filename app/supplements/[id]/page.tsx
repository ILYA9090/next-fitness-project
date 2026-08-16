import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SupplementPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SupplementPage({ params }: SupplementPageProps) {
  const { id } = await params;
  const supplement = await prisma.supplement.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      _count: {
        select: { favorites: true },
      },
    },
  });

  if (!supplement) {
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
        <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
          {supplement.imageUrl ? (
            <img
              src={supplement.imageUrl}
              alt={supplement.name}
              width={400}
              height={400}
              className="rounded-2xl object-cover w-full h-full"
            />
          ) : (
            <div className="text-6xl">💊</div>
          )}
        </div>

        <div>
          <Title text={supplement.name} size="lg" className="font-extrabold" />
          <p className="text-gray-500 mt-2">
            Категория: {supplement.category?.name}
          </p>

          <div className="mt-4 space-y-3">
            {supplement.brand && (
              <div>
                <span className="text-sm text-gray-500">Бренд</span>
                <p className="font-medium">{supplement.brand}</p>
              </div>
            )}
            {supplement.price && (
              <div>
                <span className="text-sm text-gray-500">Цена</span>
                <p className="text-2xl font-bold text-green-600">
                  {supplement.price} ₽
                </p>
              </div>
            )}
            {supplement.weight && (
              <div>
                <span className="text-sm text-gray-500">Вес</span>
                <p className="font-medium">{supplement.weight}</p>
              </div>
            )}
            {supplement.flavor && (
              <div>
                <span className="text-sm text-gray-500">Вкус</span>
                <p className="font-medium">{supplement.flavor}</p>
              </div>
            )}
          </div>

          {supplement.description && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-600 leading-relaxed">
                {supplement.description}
              </p>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500">⭐ в избранном</div>
        </div>
      </div>
    </Container>
  );
}
