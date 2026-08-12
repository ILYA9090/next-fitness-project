"use client";

import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useState, useRef, useEffect } from "react";

interface SortPopupProps {
  className?: string;
}

type SortOption = {
  label: string;
  value: string;
  order: "asc" | "desc";
};

// Убираем "popular" так как API не поддерживает его
// Используем "sortBy" вместо "sort"
const sortOptions: SortOption[] = [
  { label: "Новые", value: "createdAt", order: "desc" },
  { label: "По имени (А-Я)", value: "name", order: "asc" },
  { label: "По имени (Я-А)", value: "name", order: "desc" },
];

export const SortPopup: FC<SortPopupProps> = ({ className }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Используем "sortBy" вместо "sort"
  const currentSort = searchParams.get("sortBy") || "createdAt";
  const currentOrder = searchParams.get("order") || "desc";

  const currentLabel =
    sortOptions.find(
      (opt) => opt.value === currentSort && opt.order === currentOrder,
    )?.label || "Новые";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", option.value); // ← "sortBy" вместо "sort"
    params.set("order", option.order);
    router.push(`/?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <div
        className={cn(
          "inline-flex items-center gap-2 bg-gray-50 px-5 h-[52px] rounded-2xl cursor-pointer",
          className,
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ArrowUpDown size={16} />
        <b>Сортировка:</b>
        <b className="text-indigo-500">{currentLabel}</b>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          {sortOptions.map((option) => (
            <button
              key={`${option.value}-${option.order}`}
              className={cn(
                "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition",
                currentSort === option.value && currentOrder === option.order
                  ? "text-indigo-500 font-medium bg-indigo-50"
                  : "text-gray-700",
              )}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortPopup;
