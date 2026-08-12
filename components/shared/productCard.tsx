// components/shared/productCard.tsx
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";

export interface ProductCardProps {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
  type: "exercise" | "program" | "meal" | "supplement" | "coaching";
  className?: string;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  imageUrl,
  description,
  type,
  className,
}) => {
  // Генерируем правильный URL в зависимости от типа
  const hrefMap = {
    exercise: `/exercises/${id}`,
    program: `/programs/${id}`,
    meal: `/meals/${id}`,
    supplement: `/supplements/${id}`,
    coaching: `/coachings/${id}`,
  };

  return (
    <Link href={hrefMap[type]} className="group">
      <div
        className={cn(
          "rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition",
          className,
        )}
      >
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
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{name}</h3>
          {description && (
            <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
