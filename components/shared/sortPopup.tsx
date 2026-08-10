import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import { FC } from "react";

interface SortPopupProps {
  className?: string;
}

export const SortPopup: FC<SortPopupProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 bg-gray-50 px-5 h-[52px] rounded-2xl cursor-pointer ",
        className,
      )}
    >
      <ArrowUpDown size={16} />
      <b>Сортировка</b>
      <b style={{ color: "indigo" }}>Популярное</b>
    </div>
  );
};

export default SortPopup;
