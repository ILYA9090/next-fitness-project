import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export const dynamic = "force-dynamic";

const LIMIT_PER_CATEGORY = 5;
const MIN_QUERY_LENGTH = 2;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.trim() || "";

    if (query.length < MIN_QUERY_LENGTH) {
      return NextResponse.json({
        success: true,
        data: {
          exercises: [],
          programs: [],
          meals: [],
          coachings: [],
          supplements: [],
          total: 0,
        },
      });
    }

    const [exercises, programs, meals, coachings, supplements] =
      await Promise.all([
        prisma.exercise.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              {
                muscleGroups: {
                  some: { name: { contains: query, mode: "insensitive" } },
                },
              },
            ],
          },
          take: LIMIT_PER_CATEGORY,
          select: {
            id: true,
            name: true,
            description: true,
            videoUrl: true,
            muscleGroups: { select: { id: true, name: true, slug: true } },
            category: { select: { slug: true, name: true } },
          },
        }),

        prisma.program.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          take: LIMIT_PER_CATEGORY,
          select: {
            id: true,
            name: true,
            description: true,
            level: true,
            weeks: true,
            category: { select: { slug: true, name: true } },
          },
        }),

        prisma.meal.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          take: LIMIT_PER_CATEGORY,
          select: {
            id: true,
            name: true,
            description: true,
            calories: true,
            mealType: true,
            category: { select: { slug: true, name: true } },
          },
        }),

        prisma.coaching.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          take: LIMIT_PER_CATEGORY,
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            category: { select: { slug: true, name: true } },
          },
        }),

        prisma.supplement.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { brand: { contains: query, mode: "insensitive" } },
              { flavor: { contains: query, mode: "insensitive" } },
            ],
          },
          take: LIMIT_PER_CATEGORY,
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            brand: true,
            weight: true,
            flavor: true,
            category: { select: { slug: true, name: true } },
          },
        }),
      ]);

    const total =
      exercises.length +
      programs.length +
      meals.length +
      coachings.length +
      supplements.length;

    return NextResponse.json({
      success: true,
      query,
      data: {
        exercises,
        programs,
        meals,
        coachings,
        supplements,
        total,
      },
    });
  } catch (error) {
    console.error("❌ Ошибка поиска:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при выполнении поиска",
      },
      { status: 500 },
    );
  }
}
