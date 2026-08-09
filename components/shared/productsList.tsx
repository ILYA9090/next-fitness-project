"use client";
import { cn } from "@/lib/utils";
import { FC, RefObject, useEffect, useRef } from "react";
import { Title } from "./title";
import ProductCard from "./productCard";
import { Items } from "./types";
import { useIntersection } from "react-use";
import { useCategoryStore } from "@/store/category";
interface ProductsListProps {
  className?: string;
  items: Items[];
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

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [categoryId, setActiveCategoryId, intersection?.isIntersecting]);
  return (
    <div className={cn("", className)} id={title} ref={intersectionRef}>
      <Title text={title} className="font-extrabold mb-5" size="xl" />
      <div className={cn("grid grid-cols-2 gap-[50px]", listClassName)}>
        {items.map((item) => (
          <ProductCard
            key={item.id}
            name={item.name}
            imageUrl={item.imageUrl}
            id={item.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
