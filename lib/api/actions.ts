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
