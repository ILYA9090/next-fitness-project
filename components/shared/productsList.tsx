"use client";

import { cn } from "@/lib/utils";
import { FC, RefObject, useEffect, useRef } from "react";
import { Title } from "./title";
import ProductCard, { ProductCardProps } from "./productCard";
import { useIntersection } from "react-use";
import { useCategoryStore } from "@/store/category";
import { CATEGORIES } from "@/lib/constants";

export type ProductItem = Omit<ProductCardProps, "className">;

interface ProductsListProps {
  className?: string;
  items: ProductItem[];
  title: string;
  categoryId: number;
  listClassName?: string;
}

export const ProductsList: FC<ProductsListProps> = (props) => {
  const { className, title, items, categoryId, listClassName } = props;
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);
  const intersectionRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersection(
    intersectionRef as RefObject<HTMLElement>,
    {
      threshold: 0.4,
    },
  );

  const categorySlug =
    CATEGORIES.find((cat) => cat.id === categoryId)?.slug || "";

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [categoryId, setActiveCategoryId, intersection?.isIntersecting]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn("", className)} id={categorySlug} ref={intersectionRef}>
      <Title text={title} className="font-extrabold mb-5" size="xl" />
      <div className={cn("grid grid-cols-2 gap-[50px]", listClassName)}>
        {items.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            name={item.name}
            imageUrl={item.imageUrl}
            shortDescription={item.shortDescription}
            type={item.type}
          />
        ))}
      </div>
    </div>
  );
};
