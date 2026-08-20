"use client";

import { ProductsList } from "@/components/shared/productsList";
import { axiosInstance } from "@/lib/api";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "@/components/shared/productCard";

interface FavoriteItem {
  id: number;
  userId: number;
  entityType: "exercise" | "program" | "meal" | "coaching" | "supplement";
  entityId: number;
  entity: {
    id: number;
    name: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
    shortDescription?: string | null;
  };
  createdAt: string;
}

interface FavoritesContentProps {
  userId: number;
}

export default function FavoritesContent({ userId }: FavoritesContentProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await axiosInstance.get("/favorites");
        setFavorites(data);
      } catch (error) {
        console.error("Ошибка загрузки избранного:", error);
        toast.error("Не удалось загрузить избранное");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const favoriteItems = favorites.map((fav) => {
    const entity = fav.entity;
    return {
      id: entity?.id || 0,
      name: entity?.name || "Без названия",
      imageUrl: entity?.imageUrl || entity?.videoUrl || "/placeholder.jpg",
      shortDescription: entity?.shortDescription || "",
      type: fav.entityType,
    };
  });

  const groupedFavorites = favoriteItems.reduce(
    (acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    },
    {} as Record<string, typeof favoriteItems>,
  );

  const filteredItems =
    filter === "all"
      ? favoriteItems
      : favoriteItems.filter((item) => item.type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Все ({favoriteItems.length})
        </button>
        {Object.entries(groupedFavorites).map(([type, items]) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type === "exercise" && "🏋️ Упражнения"}
            {type === "program" && "📋 Программы"}
            {type === "meal" && "🍎 Питание"}
            {type === "supplement" && "💊 Спортпит"}
            {type === "coaching" && "👨‍🏫 Коучинг"} ({items.length})
          </button>
        ))}
      </div>

      {/* Результаты */}
      {favoriteItems.length === 0 ? (
        <div className="text-center py-20">
          <Heart
            className="text-gray-300 mx-auto mb-4"
            size={64}
            strokeWidth={1}
          />
          <p className="text-gray-400 text-lg">У вас пока нет избранного</p>
          <p className="text-gray-300 text-sm">
            Добавляйте упражнения, программы и другие материалы в избранное
          </p>
        </div>
      ) : filter === "all" ? (
        Object.entries(groupedFavorites).map(([type, items]) => {
          const categoryIdMap: Record<string, number> = {
            exercise: 1,
            program: 2,
            meal: 3,
            coaching: 4,
            supplement: 5,
          };

          const titleMap: Record<string, string> = {
            exercise: "🏋️ Упражнения",
            program: "📋 Программы",
            meal: "🍎 Питание",
            coaching: "👨‍🏫 Коучинг",
            supplement: "💊 Спортивное питание",
          };

          return (
            <ProductsList
              key={type}
              title={titleMap[type] || type}
              items={items}
              categoryId={categoryIdMap[type] || 0}
            />
          );
        })
      ) : (
        <div className="grid grid-cols-2 gap-[50px]">
          {filteredItems.map((item) => (
            <ProductCard
              key={`${item.type}-${item.id}`}
              id={item.id}
              name={item.name}
              imageUrl={item.imageUrl}
              shortDescription={item.shortDescription}
              type={item.type}
            />
          ))}
        </div>
      )}
    </div>
  );
}
