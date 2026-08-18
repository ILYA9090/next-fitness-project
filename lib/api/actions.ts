"use server";

import { Prisma } from "@/lib/generated/prisma";
import { getUserSession } from "../get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { hashSync } from "bcrypt";
import { VerificationUser } from "@/components/shared/verification-email/verificationUser";
import { sendEmail } from "../send-email";
import { revalidatePath } from "next/cache";

export const updateUserInfo = async (body: Prisma.UserCreateInput) => {
  try {
    const currentUser = await getUserSession();
    if (!currentUser) {
      throw new Error("Пользователь не найден");
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    });

    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        name: body.name,
        email: body.email,
        password: body.password
          ? hashSync(body.password, 10)
          : findUser?.password,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("❌ Ошибка обновления пользователя:", error);
    throw new Error("Не удалось обновить данные пользователя");
  }
};

export const registerUser = async (body: Prisma.UserCreateInput) => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      if (!existingUser.verified) {
        throw new Error("Почта не подтверждена. Проверьте вашу почту.");
      }
      throw new Error("Пользователь с таким email уже существует");
    }

    const createUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashSync(body.password, 10),
        verified: null,
      },
    });

    const code = Math.floor(10000 + Math.random() * 50000).toString();
    await prisma.verificationCode.create({
      data: {
        code,
        userId: createUser.id,
      },
    });

    await sendEmail(
      createUser.email,
      "Fitness Library / 📝 Подтверждение регистрации",
      VerificationUser({
        code,
      }),
    );

    revalidatePath("/auth/login");

    return {
      success: true,
      message: "Регистрация успешна. Проверьте вашу почту для подтверждения.",
    };
  } catch (error) {
    console.error("❌ Ошибка регистрации:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "Не удалось зарегистрировать пользователя",
    );
  }
};
export type FavoriteEntityType =
  "exercise" | "program" | "meal" | "supplement" | "coaching";

export const toggleFavorite = async (
  entityId: number,
  entityType: FavoriteEntityType,
) => {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error("Пользователь не авторизован");
    }

    const userId = Number(currentUser.id);

    const fieldMap: Record<FavoriteEntityType, string> = {
      exercise: "exerciseId",
      program: "programId",
      meal: "mealId",
      supplement: "supplementId",
      coaching: "coachingId",
    };

    const fieldName = fieldMap[entityType];

    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        [fieldName]: entityId,
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          [fieldName]: entityId,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/exercises");
    revalidatePath("/programs");
    revalidatePath("/meals");
    revalidatePath("/supplements");
    revalidatePath("/coachings");

    return {
      success: true,
      isFavorited: !existingFavorite,
    };
  } catch (error) {
    console.error("❌ Ошибка при работе с избранным:", error);
    throw new Error(
      error instanceof Error ? error.message : "Не удалось обновить избранное",
    );
  }
};
export type FavoriteItem = {
  id: number;
  type: "exercise" | "program" | "meal" | "supplement" | "coaching";
};

export const getFavorites = async (): Promise<FavoriteItem[]> => {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      return [];
    }

    const userId = Number(currentUser.id);

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: {
        exerciseId: true,
        programId: true,
        mealId: true,
        supplementId: true,
        coachingId: true,
      },
    });

    const items: FavoriteItem[] = [];

    favorites.forEach((fav) => {
      if (fav.exerciseId) items.push({ id: fav.exerciseId, type: "exercise" });
      if (fav.programId) items.push({ id: fav.programId, type: "program" });
      if (fav.mealId) items.push({ id: fav.mealId, type: "meal" });
      if (fav.supplementId)
        items.push({ id: fav.supplementId, type: "supplement" });
      if (fav.coachingId) items.push({ id: fav.coachingId, type: "coaching" });
    });

    return items;
  } catch (error) {
    console.error("❌ Ошибка получения избранного:", error);
    return [];
  }
};
