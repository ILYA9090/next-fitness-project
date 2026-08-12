import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const query = searchParams.get("q")?.trim() || "";
    const muscleGroups =
      searchParams.get("muscleGroups")?.split(",").filter(Boolean) || [];
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const matchAll = searchParams.get("matchAll") === "true";

    const validSortBy = ["name", "createdAt"].includes(sortBy)
      ? sortBy
      : "createdAt";
    const skip = (page - 1) * limit;

    const where: Prisma.ExerciseWhereInput = {};

    if (query.length >= 2) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (muscleGroups.length > 0) {
      if (matchAll) {
        where.muscleGroups = {
          every: {
            slug: { in: muscleGroups },
          },
        };
        where.AND = muscleGroups.map((slug) => ({
          muscleGroups: { some: { slug } },
        }));
        delete where.muscleGroups;
      } else {
        where.muscleGroups = {
          some: {
            slug: { in: muscleGroups },
          },
        };
      }
    }

    const [exercises, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        orderBy: { [validSortBy]: order },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          videoUrl: true,
          createdAt: true,
          muscleGroups: {
            select: { id: true, name: true, slug: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      }),

      prisma.exercise.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: exercises,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
        filters: {
          query,
          muscleGroups,
          sortBy: validSortBy,
          order,
          matchAll,
        },
      },
    });
  } catch (error) {
    console.error("❌ Ошибка получения упражнений:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка при получении упражнений" },
      { status: 500 },
    );
  }
}
