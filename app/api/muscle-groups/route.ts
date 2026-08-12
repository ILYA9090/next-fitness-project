import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const muscleGroups = await prisma.muscleGroup.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(muscleGroups);
  } catch (error) {
    console.error("❌ Ошибка получения групп мышц:", error);
    return NextResponse.json(
      { error: "Ошибка при получении групп мышц" },
      { status: 500 },
    );
  }
}
