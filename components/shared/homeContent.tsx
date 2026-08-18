"use client";

import {
  Container,
  Filters,
  ProductsList,
  Title,
  TopBar,
} from "@/components/shared";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/api/instance";

interface Exercise {
  id: number;
  name: string;
  description: string;
  videoUrl: string | null;
  muscleGroups: Array<{ id: number; name: string; slug: string }>;
}

interface Program {
  id: number;
  name: string;
  description: string;
  level: string;
  weeks: number;
  muscleGroups: Array<{ id: number; name: string; slug: string }>;
  exerciseCount: number;
}

interface Meal {
  id: number;
  name: string;
  description: string;
  calories: number;
  mealType: string;
}

interface Supplement {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  brand: string;
  weight: number;
  flavor: string;
}

interface Coaching {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
}

interface CatalogResponse {
  success: boolean;
  data: {
    exercises: Exercise[];
    programs: Program[];
    meals: Meal[];
    supplements: Supplement[];
    coachings: Coaching[];
  };
  meta: {
    exercisesTotal: number;
    programsTotal: number;
    mealsTotal: number;
    supplementsTotal: number;
    coachingsTotal: number;
    total: number;
  };
}

export default function HomeContent() {
  const searchParams = useSearchParams();

  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(
    [],
  );
  const [catalogData, setCatalogData] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") || "desc";

  const hasMuscleFilter = selectedMuscleGroups.length > 0;

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (selectedMuscleGroups.length > 0) {
          params.append("muscleGroups", selectedMuscleGroups.join(","));
        }

        params.append("sortBy", sortBy);
        params.append("order", order);

        const { data } = await axiosInstance.get<CatalogResponse>(
          `/catalog?${params.toString()}`,
        );

        setCatalogData(data);
      } catch (error) {
        console.error("Ошибка загрузки каталога:", error);
        setError("Не удалось загрузить каталог");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMuscleGroups, sortBy, order]);

  const exercises = catalogData?.data?.exercises || [];
  const programs = catalogData?.data?.programs || [];
  const meals = catalogData?.data?.meals || [];
  const supplements = catalogData?.data?.supplements || [];
  const coachings = catalogData?.data?.coachings || [];

  return (
    <>
      <Container className="mt-10">
        <Title text="Программы и советы" size="lg" className="font-extrabold" />
      </Container>

      <TopBar />

      <Container className="pb-14 mt-10">
        <div className="flex gap-[60px]">
          <div className="w-[250px]">
            <Filters onFilterChange={setSelectedMuscleGroups} />
          </div>

          <div className="flex-1">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {error && (
              <div className="text-center py-12 text-red-500">{error}</div>
            )}

            {!loading && !error && (
              <div className="flex flex-col gap-16">
                {exercises.length > 0 && (
                  <ProductsList
                    title="🏋️ Упражнения"
                    items={exercises.map((ex) => ({
                      id: ex.id,
                      name: ex.name,
                      imageUrl: ex.videoUrl || "/placeholder.jpg",
                      description: ex.description || "",
                      type: "exercise",
                    }))}
                    categoryId={1}
                  />
                )}

                {programs.length > 0 && (
                  <ProductsList
                    title="📋 Программы"
                    items={programs.map((prog) => ({
                      id: prog.id,
                      name: prog.name,
                      imageUrl: "/placeholder-program.jpg",
                      description: prog.description || "",
                      type: "program",
                    }))}
                    categoryId={2}
                  />
                )}

                {!hasMuscleFilter && meals.length > 0 && (
                  <ProductsList
                    title="🍎 Питание"
                    items={meals.map((meal) => ({
                      id: meal.id,
                      name: meal.name,
                      imageUrl: "/placeholder-meal.jpg",
                      description: meal.description || "",
                      type: "meal",
                    }))}
                    categoryId={3}
                  />
                )}

                {!hasMuscleFilter && supplements.length > 0 && (
                  <ProductsList
                    title="💊 Спортивное питание"
                    items={supplements.map((sup) => ({
                      id: sup.id,
                      name: sup.name,
                      imageUrl: sup.imageUrl || "/placeholder-supplement.jpg",
                      description: sup.description || "",
                      type: "supplement",
                    }))}
                    categoryId={5}
                  />
                )}

                {!hasMuscleFilter && coachings.length > 0 && (
                  <ProductsList
                    title="👨‍🏫 Онлайн-ведение"
                    items={coachings.map((coach) => ({
                      id: coach.id,
                      name: coach.name,
                      imageUrl: "/placeholder-coaching.jpg",
                      description: coach.description || "",
                      type: "coaching",
                    }))}
                    categoryId={4}
                  />
                )}

                {exercises.length === 0 &&
                  programs.length === 0 &&
                  meals.length === 0 &&
                  supplements.length === 0 &&
                  coachings.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      Ничего не найдено по выбранным фильтрам
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
