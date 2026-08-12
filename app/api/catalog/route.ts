import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const muscleGroups =
      searchParams.get("muscleGroups")?.split(",").filter(Boolean) || [];
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";
    const limit = parseInt(searchParams.get("limit") || "12");
    const matchAll = searchParams.get("matchAll") === "true";

    const validSortBy = ["name", "createdAt"].includes(sortBy)
      ? sortBy
      : "createdAt";

    const exerciseWhere: Prisma.ExerciseWhereInput = {};
    if (muscleGroups.length > 0) {
      if (matchAll) {
        exerciseWhere.AND = muscleGroups.map((slug) => ({
          muscleGroups: { some: { slug } },
        }));
      } else {
        exerciseWhere.muscleGroups = {
          some: { slug: { in: muscleGroups } },
        };
      }
    }

    const programWhere: Prisma.ProgramWhereInput = {};
    if (muscleGroups.length > 0) {
      if (matchAll) {
        programWhere.AND = muscleGroups.map((slug) => ({
          exercises: {
            some: {
              exercise: {
                muscleGroups: { some: { slug } },
              },
            },
          },
        }));
      } else {
        programWhere.exercises = {
          some: {
            exercise: {
              muscleGroups: {
                some: { slug: { in: muscleGroups } },
              },
            },
          },
        };
      }
    }

    const [exercises, programs, exercisesTotal, programsTotal] =
      await Promise.all([
        prisma.exercise.findMany({
          where: exerciseWhere,
          orderBy: { [validSortBy]: order },
          take: limit,
          select: {
            id: true,
            name: true,
            description: true,
            videoUrl: true,
            createdAt: true,
            muscleGroups: { select: { id: true, name: true, slug: true } },
            _count: { select: { favorites: true } },
          },
        }),

        prisma.program.findMany({
          where: programWhere,
          orderBy: { [validSortBy]: order },
          take: limit,
          select: {
            id: true,
            name: true,
            description: true,
            level: true,
            weeks: true,
            createdAt: true,
            exercises: {
              select: {
                exercise: {
                  select: {
                    muscleGroups: {
                      select: { id: true, name: true, slug: true },
                    },
                  },
                },
              },
            },
            _count: { select: { exercises: true, favorites: true } },
          },
        }),

        prisma.exercise.count({ where: exerciseWhere }),
        prisma.program.count({ where: programWhere }),
      ]);

    const programsWithMuscles = programs.map((program) => {
      const muscleMap = new Map<
        number,
        { id: number; name: string; slug: string }
      >();
      program.exercises.forEach((pe) => {
        pe.exercise.muscleGroups.forEach((mg) => muscleMap.set(mg.id, mg));
      });

      return {
        id: program.id,
        name: program.name,
        description: program.description,
        level: program.level,
        weeks: program.weeks,
        createdAt: program.createdAt,
        muscleGroups: Array.from(muscleMap.values()),
        exerciseCount: program._count.exercises,
        favoriteCount: program._count.favorites,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        exercises,
        programs: programsWithMuscles,
      },
      meta: {
        exercisesTotal,
        programsTotal,
        total: exercisesTotal + programsTotal,
        filters: { muscleGroups, matchAll, sortBy: validSortBy, order },
      },
    });
  } catch (error) {
    console.error("❌ Ошибка получения каталога:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка при получении каталога" },
      { status: 500 },
    );
  }
}
