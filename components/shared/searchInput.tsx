"use client";

import { Api, type SearchResponse } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useDebounce } from "./hooks/debounce";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchInputProps {
  className?: string;
}

export const SearchInput = ({ className }: SearchInputProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<SearchResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Дебаунс
  const debouncedQuery = useDebounce(searchQuery, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length < 2) {
      queueMicrotask(() => {
        setResults(null);
        setIsLoading(false);
      });
      return;
    }

    const controller = new AbortController();

    queueMicrotask(() => setIsLoading(true));

    const fetchResults = async () => {
      try {
        const response = await Api.search.search(trimmed, {
          signal: controller.signal,
        });
        if (response.success) {
          setResults(response.data);
        }
      } catch (error: unknown) {
        const isCanceled =
          error instanceof Error &&
          (error.name === "CanceledError" || error.name === "AbortError");

        if (!isCanceled) {
          console.error("Ошибка поиска:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchResults();

    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onFocus = useCallback(() => setFocused(true), []);

  const showDropdown = focused && searchQuery.length >= 2;
  const hasResults = results && results.total > 0;

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex rounded-2xl flex-1 justify-between relative h-11",
          className,
        )}
      >
        <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
        <input
          className="rounded-2xl outline-none w-full bg-gray-50 pl-11 pr-10"
          type="text"
          placeholder="Найти программу или упражнение"
          value={searchQuery}
          onChange={handleChange}
          onFocus={onFocus}
        />
        {isLoading && (
          <Loader2 className="absolute top-1/2 -translate-y-1/2 right-3 h-5 w-5 animate-spin text-gray-400" />
        )}
      </div>

      {showDropdown && (
        <div className="absolute w-full bg-white rounded-xl py-2 top-14 shadow-lg z-30 max-h-96 overflow-y-auto">
          {isLoading && !results && (
            <div className="flex items-center justify-center py-4 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Поиск...
            </div>
          )}

          {!isLoading && results && !hasResults && (
            <div className="px-4 py-6 text-center text-gray-500">
              Ничего не найдено 😔
            </div>
          )}

          {hasResults && (
            <>
              {results.exercises.length > 0 && (
                <SearchSection title="🏋️ Упражнения">
                  {results.exercises.map((ex) => (
                    <Link
                      key={ex.id}
                      href={`/exercises/${ex.id}`}
                      onClick={() => setFocused(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center flex-shrink-0 text-lg">
                        💪
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{ex.name}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {ex.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </SearchSection>
              )}

              {results.programs.length > 0 && (
                <SearchSection title="📋 Программы">
                  {results.programs.map((prog) => (
                    <Link
                      key={prog.id}
                      href={`/programs/${prog.id}`}
                      onClick={() => setFocused(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center flex-shrink-0 text-lg">
                        📋
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{prog.name}</div>
                        <div className="text-sm text-gray-500">
                          {prog.level} • {prog.weeks} недель
                        </div>
                      </div>
                    </Link>
                  ))}
                </SearchSection>
              )}

              {results.meals.length > 0 && (
                <SearchSection title="🍎 Питание">
                  {results.meals.map((meal) => (
                    <Link
                      key={meal.id}
                      href={`/meals/${meal.id}`}
                      onClick={() => setFocused(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <div className="w-10 h-10 rounded bg-orange-100 flex items-center justify-center flex-shrink-0 text-lg">
                        🍎
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{meal.name}</div>
                        <div className="text-sm text-gray-500">
                          {meal.calories} ккал • {meal.mealType}
                        </div>
                      </div>
                    </Link>
                  ))}
                </SearchSection>
              )}

              {results.supplements.length > 0 && (
                <SearchSection title="💊 Спортпит">
                  {results.supplements.map((sup) => (
                    <Link
                      key={sup.id}
                      href={`/supplements/${sup.id}`}
                      onClick={() => setFocused(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition"
                    >
                      {sup.imageUrl ? (
                        <img
                          src={sup.imageUrl}
                          alt={sup.name}
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center flex-shrink-0 text-lg">
                          💊
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{sup.name}</div>
                        <div className="text-sm text-gray-500">
                          {sup.brand} • {sup.price} ₽
                        </div>
                      </div>
                    </Link>
                  ))}
                </SearchSection>
              )}

              {results.coachings.length > 0 && (
                <SearchSection title="👨‍🏫 Коучинг">
                  {results.coachings.map((coach) => (
                    <Link
                      key={coach.id}
                      href={`/coachings/${coach.id}`}
                      onClick={() => setFocused(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <div className="w-10 h-10 rounded bg-pink-100 flex items-center justify-center flex-shrink-0 text-lg">
                        👨‍🏫
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{coach.name}</div>
                        <div className="text-sm text-gray-500">
                          {coach.price} ₽ • {coach.duration}
                        </div>
                      </div>
                    </Link>
                  ))}
                </SearchSection>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

function SearchSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b last:border-b-0">
      <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase sticky top-0">
        {title}
      </div>
      {children}
    </div>
  );
}
