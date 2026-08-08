import { cn } from "@/lib/utils";
import { FC } from "react";
import { Title } from "./title";
import ProductCard from "./productCard";
import { Items } from "./types";

interface ProductsListProps {
  className?: string;
  items: Items[];
  title: string;
  categoryId: number;
  listClassName?: string;
}

export const ProductsList: FC<ProductsListProps> = (props) => {
  const { className, title, items, categoryId, listClassName } = props;
  return (
    <div className={cn("", className)}>
      <Title text={title} className="font-extrabold mb-5" />
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
