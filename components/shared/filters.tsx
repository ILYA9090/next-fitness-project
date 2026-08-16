// components/shared/filters.tsx
"use client";

import { FC, useEffect, useState } from "react";
import { Title } from "./title";
import CheckboxFilterGroup from "./checkbox-filter-group";
import { axiosInstance } from "@/lib/api/instance";

interface MuscleGroup {
  id: number;
  name: string;
  slug: string;
}

interface FiltersProps {
  className?: string;
  onFilterChange?: (selectedSlugs: string[]) => void;
}

export const Filters: FC<FiltersProps> = ({ className, onFilterChange }) => {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(
    [],
  );

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const { data } = await axiosInstance.get("/muscle-groups");
        setMuscleGroups(data);
      } catch (error) {
        console.error("Ошибка загрузки групп мышц:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMuscleGroups();
  }, []);

  const handleCheckboxChange = (values: string[]) => {
    setSelectedMuscleGroups(values);
    onFilterChange?.(values);
  };

  if (loading) {
    return (
      <div className={className}>
        <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  const items = muscleGroups.map((group) => ({
    text: group.name,
    value: group.slug,
  }));

  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

      <CheckboxFilterGroup
        title="Группы мышц"
        className="mt-10"
        limit={4}
        items={items}
        defaultItems={items.slice(0, 4)}
        onChange={handleCheckboxChange}
        searchInputPlaceholder="Поиск группы мышц..."
      />
    </div>
  );
};
