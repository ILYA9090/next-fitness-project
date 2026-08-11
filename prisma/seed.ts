import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma";
import { hashSync } from "bcrypt";
const connectionString = process.env.POSTGRES_URL_NON_POOLING!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ========== ОЧИСТКА БД ==========
async function down() {
  console.log("🧹 Очищаем базу данных...");

  await prisma.$executeRaw`TRUNCATE TABLE "Favorite" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProgramExercise" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Exercise" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Program" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Meal" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Coaching" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "VerificationCode" RESTART IDENTITY CASCADE;`;

  console.log("✅ База очищена");
}

async function up() {
  console.log("🌱 Начинаем сидирование...");

  console.log("👤 Создаём пользователей...");

  await prisma.user.createMany({
    data: [
      {
        email: "user@example.com",
        password: hashSync("111111", 10),
        name: "Обычный пользователь",
        role: "USER",
        verified: new Date(),
      },
      {
        email: "admin@example.com",
        password: hashSync("111111", 10),
        name: "Администратор",
        role: "ADMIN",
        verified: new Date(),
      },
      {
        email: "test@example.com",
        password: hashSync("111111", 10),
        name: "Тестовый пользователь",
        role: "USER",
        verified: null,
      },
    ],
  });
  console.log("✅ Добавлены пользователи");

  // ========== КАТЕГОРИИ ==========
  console.log("📁 Создаём категории...");

  await prisma.category.createMany({
    data: [
      { name: "Упражнения", slug: "exercises" },
      { name: "Программы", slug: "programs" },
      { name: "Питание", slug: "meals" },
      { name: "Онлайн-ведение", slug: "coachings" },
    ],
  });

  // ========== УПРАЖНЕНИЯ ==========
  console.log("🏋️ Создаём упражнения...");

  const exerciseCategory = await prisma.category.findUnique({
    where: { slug: "exercises" },
  });

  if (exerciseCategory) {
    await prisma.exercise.createMany({
      data: [
        {
          name: "Жим лёжа",
          description: "Классическое упражнение на грудные мышцы",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
        {
          name: "Приседания со штангой",
          description: "Базовое упражнение для ног и ягодиц",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
        {
          name: "Становая тяга",
          description: "Упражнение для всего тела",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
        {
          name: "Подтягивания",
          description: "Отличное упражнение для спины и бицепсов",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
        {
          name: "Отжимания от пола",
          description: "Базовое упражнение для грудных мышц, трицепсов и плеч",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
      ],
    });
    console.log("✅ Добавлены упражнения");
  }

  // ========== ПРОГРАММЫ ==========
  console.log("📋 Создаём программы...");

  const programCategory = await prisma.category.findUnique({
    where: { slug: "programs" },
  });

  if (programCategory) {
    await prisma.program.createMany({
      data: [
        {
          name: "Набор мышечной массы",
          description: "8-недельная программа для набора мышечной массы",
          level: "medium",
          weeks: 8,
          categoryId: programCategory.id,
        },
        {
          name: "Сушка",
          description: "6-недельная программа для жиросжигания и рельефа",
          level: "hard",
          weeks: 6,
          categoryId: programCategory.id,
        },
        {
          name: "Новичок",
          description:
            "4-недельная программа базовых упражнений для начинающих",
          level: "easy",
          weeks: 4,
          categoryId: programCategory.id,
        },
      ],
    });
    console.log("✅ Добавлены программы");

    // ========== СВЯЗЬ ПРОГРАММА → УПРАЖНЕНИЯ ==========
    console.log("🔗 Связываем программы с упражнениями...");

    const programs = await prisma.program.findMany();
    const exercises = await prisma.exercise.findMany();

    if (programs.length > 0 && exercises.length > 0) {
      for (let p = 0; p < programs.length; p++) {
        const program = programs[p];
        const exercisesToAdd = exercises.slice(0, 3);

        for (let e = 0; e < exercisesToAdd.length; e++) {
          const exercise = exercisesToAdd[e];
          await prisma.programExercise.create({
            data: {
              programId: program.id,
              exerciseId: exercise.id,
              sets: 3 + e,
              reps: 10 - e * 2,
              order: e + 1,
            },
          });
        }
      }
      console.log("✅ Созданы связи программ с упражнениями");
    }
  }

  // ========== ПИТАНИЕ ==========
  console.log("🍎 Создаём блюда...");

  const mealCategory = await prisma.category.findUnique({
    where: { slug: "meals" },
  });

  if (mealCategory) {
    await prisma.meal.createMany({
      data: [
        {
          name: "Овсянка с ягодами",
          description:
            "Овсянка на молоке с замороженными ягодами, орехами и мёдом",
          calories: 350,
          mealType: "breakfast",
          categoryId: mealCategory.id,
        },
        {
          name: "Куриная грудка с гречкой",
          description: "Отварная куриная грудка с гречкой и овощами",
          calories: 450,
          mealType: "lunch",
          categoryId: mealCategory.id,
        },
        {
          name: "Рыба с рисом",
          description: "Запечённая рыба с рисом и брокколи",
          calories: 400,
          mealType: "lunch",
          categoryId: mealCategory.id,
        },
        {
          name: "Творог с фруктами",
          description: "Нежирный творог с бананом, ягодами и мёдом",
          calories: 250,
          mealType: "snack",
          categoryId: mealCategory.id,
        },
        {
          name: "Омлет с овощами",
          description: "Омлет из трёх яиц с помидорами, шпинатом и сыром",
          calories: 300,
          mealType: "breakfast",
          categoryId: mealCategory.id,
        },
      ],
    });
    console.log("✅ Добавлены блюда");
  }

  // ========== ОНЛАЙН-ВЕДЕНИЕ ==========
  console.log("👨‍🏫 Создаём онлайн-ведение...");

  const coachingCategory = await prisma.category.findUnique({
    where: { slug: "coachings" },
  });

  if (coachingCategory) {
    await prisma.coaching.createMany({
      data: [
        {
          name: "Персональный онлайн-коучинг",
          description:
            "Индивидуальная программа тренировок и питания с поддержкой тренера 24/7",
          price: 9900,
          duration: "1 месяц",
          categoryId: coachingCategory.id,
        },
        {
          name: "Групповой марафон",
          description: "30-дневный марафон с группой единомышленников",
          price: 4900,
          duration: "30 дней",
          categoryId: coachingCategory.id,
        },
        {
          name: "Экспресс-консультация",
          description: "60-минутная консультация по питанию и тренировкам",
          price: 2500,
          duration: "1 консультация",
          categoryId: coachingCategory.id,
        },
      ],
    });
    console.log("✅ Добавлены онлайн-ведения");
  }

  console.log("🌱 Сидирование завершено!");
}

// ========== ЗАПУСК ==========
async function main() {
  try {
    await down();
    await up();
  } catch (error) {
    console.error("❌ Ошибка:", error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error("❌ Критическая ошибка:", error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
