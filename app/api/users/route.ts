import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении пользователей" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const user = await prisma.user.create({
    data: body,
  });
  return NextResponse.json(user);
}
