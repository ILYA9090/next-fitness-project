import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Title } from "./title";
import { Button } from "../ui";
import { Star } from "lucide-react";
import { Items } from "./types";

interface ProductCardProps extends Items {
  className?: string;
}

export const ProductCard: FC<ProductCardProps> = (props) => {
  const { className, id, name, imageUrl } = props;
  return (
    <div className={className}>
      <Link href={`/product/${id}`} />
      <div className="flex justify-center p-6 bg-secondary rounded-lg h-[260px]">
        <img
          className="w-[210px] h-[215px] object-contain"
          src={imageUrl}
          alt={name}
          width={210}
          height={215}
        />
      </div>
      <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />
      <p className="text-sm text-gray-400">Какое то описание</p>
      <div className="flex items-center justify-end mt-4">
        <Button variant="ghost">
          <Star size={20} className="mr-1" color="indigo" />
          Добавить в избранное
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
