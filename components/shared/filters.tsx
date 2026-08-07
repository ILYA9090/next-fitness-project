import { FC } from "react";
import { Title } from "./title";
import { CheckboxFilter } from "./checkboxFilter";

interface FiltersProps {
  className?: string;
}

export const Filters: FC<FiltersProps> = ({ className }) => {
  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />
      <div className="flex flex-col gap-4">
        <CheckboxFilter text="chest" value="chest" />
        <CheckboxFilter text="chest" value="chest" />
      </div>
    </div>
  );
};

export default Filters;
