"use client";

import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/store/category";
import { FC, useEffect } from "react";

interface CategoriesProps {
  className?: string;
}

const cats = [
  { id: 1, name: "Упражнения" },
  { id: 2, name: "Программы" },
  { id: 3, name: "Питание" },
  { id: 4, name: "Ведение" },
  { id: 5, name: "Спортивное питание" },
];

export const Categories: FC<CategoriesProps> = ({ className }) => {
  const categoryActiveId = useCategoryStore((state) => state.activeId);
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);

  useEffect(() => {
    const handleScroll = () => {
      const sections = cats
        .map((cat) => document.getElementById(cat.name))
        .filter(Boolean);

      let closestSectionId = 1;
      let closestDistance = Infinity;

      sections.forEach((section, index) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          const centerY = rect.top + rect.height / 2;
          const viewportCenter = window.innerHeight / 2;
          const distance = Math.abs(centerY - viewportCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestSectionId = cats[index].id;
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
      {cats.map((cat) => (
        <a
          key={cat.id}
          href={`/#${cat.name}`}
          className={cn(
            "flex items-center font-bold h-11 rounded-2xl px-5",
            categoryActiveId === cat.id &&
              "bg-white shadow-md shadow-gray-200 text-primary",
          )}
        >
          <button>{cat.name}</button>
        </a>
      ))}
    </div>
  );
};

export default Categories;
