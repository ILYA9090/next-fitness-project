import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.muscleGroup.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при получении мышечных групп" },
      { status: 500 },
    );
  }
}
