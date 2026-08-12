"use client";

import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/store/category";
import { FC, useCallback, useEffect } from "react";
import { CATEGORIES } from "@/lib/constants";

interface CategoriesProps {
  className?: string;
}

export const Categories: FC<CategoriesProps> = ({ className }) => {
  const categoryActiveId = useCategoryStore((state) => state.activeId);
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);

  const scrollToCategory = useCallback(
    (slug: string, id: number) => {
      const element = document.getElementById(slug);
      if (element) {
        const topOffset = 100;
        const elementPosition =
          element.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: elementPosition - topOffset,
          behavior: "smooth",
        });

        setActiveCategoryId(id);
      }
    },
    [setActiveCategoryId],
  );

  useEffect(() => {
    const handleScroll = () => {
      let closestSectionId = 1;
      let closestDistance = Infinity;

      CATEGORIES.forEach((cat) => {
        const section = document.getElementById(cat.slug);
        if (section) {
          const rect = section.getBoundingClientRect();
          const centerY = rect.top + rect.height / 2;
          const viewportCenter = window.innerHeight / 2;
          const distance = Math.abs(centerY - viewportCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestSectionId = cat.id;
          }
        }
      });

      setActiveCategoryId(closestSectionId);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setActiveCategoryId]);

  return (
    <div
      className={cn("inline-flex gap-1 bg-gray-50 p-1 rounded-2xl", className)}
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => scrollToCategory(cat.slug, cat.id)}
          className={cn(
            "flex items-center font-bold h-11 rounded-2xl px-5 transition",
            categoryActiveId === cat.id
              ? "bg-white shadow-md shadow-gray-200 text-primary"
              : "text-gray-700 hover:text-primary",
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default Categories;
