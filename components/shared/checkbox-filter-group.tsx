"use client";
import React, { FC, useCallback, useState, useEffect } from "react";
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
    defaultValue = [],
    searchInputPlaceholder = "Поиск...",
    limit = 5,
    onChange,
    className,
  } = props;

  const [showAll, setShowAll] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);

  const filteredItems = items.filter((item) =>
    item.text.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const displayItems = showAll ? filteredItems : filteredItems.slice(0, limit);

  const handleShowAll = useCallback(() => setShowAll(!showAll), [showAll]);

  const handleCheckboxChange = useCallback(
    (value: string, checked: boolean) => {
      let newSelected: string[];
      if (checked) {
        newSelected = [...selectedValues, value];
      } else {
        newSelected = selectedValues.filter((v) => v !== value);
      }

      setSelectedValues(newSelected);

      if (onChange) {
        onChange(newSelected);
      }
    },
    [selectedValues, onChange],
  );

  return (
    <div className={cn("", className)}>
      <p className="font-bold mb-3">{title}</p>
      <div className="mb-5">
        {showAll && (
          <Input
            placeholder={searchInputPlaceholder}
            className="bg-gray-50 border-none"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        )}
        <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar mt-3">
          {displayItems.map((item) => (
            <CheckboxFilter
              key={item.value}
              value={item.value}
              text={item.text}
              checked={selectedValues.includes(item.value)}
              onCheckedChange={(checked) =>
                handleCheckboxChange(item.value, checked)
              }
              endAdornment={item.endAdornment}
            />
          ))}
        </div>
        {items.length > limit && (
          <div className={showAll ? "border-t border-t-neutral-100 mt-4" : ""}>
            <button onClick={handleShowAll} className="text-primary mt-3">
              {showAll ? "Скрыть" : `Показать всё (${items.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckboxFilterGroup;
