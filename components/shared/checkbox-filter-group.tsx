"use client";
import React, { FC, useCallback, useState } from "react";
import { CheckboxFilter, CheckboxFilterProps } from "./checkboxFilter";
import { cn } from "@/lib/utils";
import { Input } from "../ui";

type Item = CheckboxFilterProps;

interface CheckboxFilterGroupProps {
  className?: string;
  title: string;
  items: Item[];
  defaultItems?: Item[];
  limit?: number;
  searchInputPlaceholder?: string;
  onChange?: (value: string[]) => void;
  defaultValue?: string[];
}

export const CheckboxFilterGroup: FC<CheckboxFilterGroupProps> = (props) => {
  const {
    title,
    items,
    defaultItems,
    defaultValue,
    searchInputPlaceholder = "Поиск...",
    limit = 0,
    onChange,
    className,
  } = props;

  const [showAll, setShowAll] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const list = showAll
    ? items.filter((item) => item.text.toLowerCase().includes(searchValue))
    : defaultItems?.slice(0, limit);
  const handleShowAll = useCallback(() => setShowAll(!showAll), [showAll]);
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  return (
    <div className={cn("", className)}>
      <p className="font-bold mb-3">{title}</p>
      <div className="mb-5">
        {showAll && (
          <Input
            placeholder={searchInputPlaceholder}
            className="bg-gray-50 border-none"
            // value={}
            onChange={onChangeSearch}
          />
        )}
        <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar mt-3">
          {list?.map((item) => (
            <CheckboxFilter
              value={item.value}
              text={item.text}
              key={item.text}
              onCheckedChange={() => {}}
              checked={false}
              endAdornment={item.endAdornment}
            />
          ))}
        </div>
        {items.length > limit && (
          <div className={showAll ? "border-t border-t-neutral-100 mt-4" : ""}>
            <button onClick={handleShowAll} className="text-primary mt-3">
              {showAll ? "Скрыть" : "Показать всё"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckboxFilterGroup;
