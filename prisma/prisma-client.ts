// prisma/prisma-client.ts
import { Prisma, PrismaClient } from "@/lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.POSTGRES_URL_NON_POOLING!,
  });

  const options: Prisma.PrismaClientOptions = {
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  };
  return new PrismaClient(options);
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
