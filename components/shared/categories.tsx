import { cn } from "@/lib/utils";
import { FC } from "react";

interface CategoriesProps {
  className?: string;
}

const cats = [
  "Рекомендации",
  "Программы",
  "Питание",
  "Ведение",
  "Спортивное питание",
];
const activeIndex = 0;
export const Categories: FC<CategoriesProps> = ({ className }) => {
  return (
    <div
      className={cn("inline-flex gap-1 bg-gray-50 p-1 rounded-2xl", className)}
    >
      {cats.map((cat, index) => (
        <a
          key={cat}
          className={cn(
            "flex items-center font-bold h-11 rounded-2xl px-5",
            activeIndex === index &&
              "bg-white shadow-md shadow-gray-200 text-primary",
          )}
        >
          <button>{cat}</button>
        </a>
      ))}
    </div>
  );
};

export default Categories;
