// app/api/favorites/route.ts
import { authOptions } from "@/auth";
import { prisma } from "@/prisma/prisma-client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        exercise: {
          include: {
            muscleGroups: true,
            category: true,
          },
        },
        program: {
          include: {
            category: true,
          },
        },
        meal: {
          include: {
            category: true,
          },
        },
        coaching: {
          include: {
            category: true,
          },
        },
        supplement: {
          include: {
            category: true,
          },
        },
      },
    });

    const formattedFavorites = favorites.map((fav) => {
      let entity = null;
      let type = "";

      if (fav.exercise) {
        entity = fav.exercise;
        type = "exercise";
      } else if (fav.program) {
        entity = fav.program;
        type = "program";
      } else if (fav.meal) {
        entity = fav.meal;
        type = "meal";
      } else if (fav.coaching) {
        entity = fav.coaching;
        type = "coaching";
      } else if (fav.supplement) {
        entity = fav.supplement;
        type = "supplement";
      }

      return {
        id: fav.id,
        userId: fav.userId,
        entityType: type,
        entityId:
          fav.exerciseId ||
          fav.programId ||
          fav.mealId ||
          fav.coachingId ||
          fav.supplementId,
        entity,
        createdAt: fav.createdAt,
      };
    });

    return NextResponse.json(formattedFavorites);
  } catch (error) {
    console.error("❌ Ошибка получения избранного:", error);
    return NextResponse.json(
      { error: "Ошибка при получении избранного" },
      { status: 500 },
    );
  }
}
