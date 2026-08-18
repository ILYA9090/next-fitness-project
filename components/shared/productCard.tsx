"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC, useEffect } from "react";
import { Button } from "../ui";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/favorite";
import { FavoriteEntityType } from "@/lib/api/actions";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export interface ProductCardProps {
  id: number;
  name: string;
  imageUrl: string;
  shortDescription?: string;
  type: FavoriteEntityType;
  className?: string;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  imageUrl,
  shortDescription,
  type,
  className,
}) => {
  const { toggle, isFavorited, fetchFavorites, isInitialized } =
    useFavoritesStore();

  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const isFav = isFavorited(id, type);

  useEffect(() => {
    if (!isInitialized) {
      fetchFavorites();
    }
  }, [isInitialized, fetchFavorites]);

  const hrefMap = {
    exercise: `/exercises/${id}`,
    program: `/programs/${id}`,
    meal: `/meals/${id}`,
    supplement: `/supplements/${id}`,
    coaching: `/coachings/${id}`,
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error(
        "Добавить в избранное может только авторизованный пользователь",
      );
      return;
    }

    toggle(id, type);
  };

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition",
        className,
      )}
    >
      <Link href={hrefMap[type]} className="group">
        <div className="aspect-video bg-gray-100 relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {type === "exercise" && "🏋️"}
              {type === "program" && "📋"}
              {type === "meal" && "🍎"}
              {type === "supplement" && "💊"}
              {type === "coaching" && "👨‍🏫"}
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{name}</h3>
        {shortDescription && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {shortDescription}
          </p>
        )}

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleToggleFavorite}
            className="flex gap-2"
          >
            <Heart
              size={18}
              fill={isFav ? "red" : "none"}
              color={isFav ? "red" : "currentColor"}
              className="transition"
            />
            {isFav ? "В избранном" : "В избранное"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
