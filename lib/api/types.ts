export interface MuscleGroup {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  slug: string;
  name: string;
}

export interface SearchExercise {
  id: number;
  name: string;
  description: string | null;
  videoUrl: string | null;
  muscleGroups: MuscleGroup[];
  category: Category;
}

export interface SearchProgram {
  id: number;
  name: string;
  description: string | null;
  level: string;
  weeks: number | null;
  category: Category;
}

export interface SearchMeal {
  id: number;
  name: string;
  description: string | null;
  calories: number | null;
  mealType: string;
  category: Category;
}

export interface SearchCoaching {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  duration: string | null;
  category: Category;
}

export interface SearchSupplement {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  brand: string | null;
  weight: string | null;
  flavor: string | null;
  category: Category;
}

export interface SearchResponse {
  success: boolean;
  query: string;
  data: {
    exercises: SearchExercise[];
    programs: SearchProgram[];
    meals: SearchMeal[];
    coachings: SearchCoaching[];
    supplements: SearchSupplement[];
    total: number;
  };
}
