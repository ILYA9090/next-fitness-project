import { FC } from "react";
import { Title } from "./title";
import CheckboxFilterGroup from "./checkbox-filter-group";
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
      <CheckboxFilterGroup
        title="список"
        className="mt-10"
        limit={4}
        defaultItems={[
          { text: "грудные", value: "1" },
          { text: "спина", value: "2" },
          { text: "бицепс", value: "3" },
          { text: "трицепс", value: "4" },
          { text: "средняя дельта", value: "5" },
          { text: "ноги", value: "6" },
          { text: "пресс", value: "7" },
          { text: "плечи", value: "8" },
        ]}
        items={[
          { text: "грудные", value: "1" },
          { text: "спина", value: "2" },
          { text: "бицепс", value: "3" },
          { text: "трицепс", value: "4" },
          { text: "средняя дельта", value: "5" },
          { text: "ноги", value: "6" },
          { text: "пресс", value: "7" },
          { text: "плечи", value: "8" },
        ]}
      />
    </div>
  );
};

export default Filters;
