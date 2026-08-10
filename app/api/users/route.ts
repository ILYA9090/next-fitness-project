// app/api/users/route.ts
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.User.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении пользователей" },
      { status: 500 },
    );
  }
}
