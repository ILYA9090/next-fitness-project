// prisma/seed.ts
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma";
import { hashSync } from "bcrypt";

const connectionString = process.env.POSTGRES_URL_NON_POOLING!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function down() {
  console.log("🧹 Очищаем базу данных...");

  await prisma.$executeRaw`TRUNCATE TABLE "Favorite" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProgramExercise" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "_ExerciseToMuscleGroup" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Exercise" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Program" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Meal" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Coaching" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Supplement" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "MuscleGroup" RESTART IDENTITY CASCADE;`;
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

  console.log("📁 Создаём категории...");

  await prisma.category.createMany({
    data: [
      { name: "Упражнения", slug: "exercises" },
      { name: "Программы", slug: "programs" },
      { name: "Питание", slug: "meals" },
      { name: "Онлайн-ведение", slug: "coachings" },
      { name: "Спортивное питание", slug: "supplements" },
    ],
  });

  console.log("💪 Создаём группы мышц...");

  await prisma.muscleGroup.createMany({
    data: [
      { name: "Грудные", slug: "chest" },
      { name: "Бицепс", slug: "biceps" },
      { name: "Трицепс", slug: "triceps" },
      { name: "Передняя дельта", slug: "front-delt" },
      { name: "Средняя дельта", slug: "side-delt" },
      { name: "Задняя дельта", slug: "rear-delt" },
      { name: "Широчайшие спины", slug: "lats" },
      { name: "Трапеции", slug: "traps" },
      { name: "Поясница", slug: "lower-back" },
      { name: "Квадрицепс", slug: "quads" },
      { name: "Бицепс бедра", slug: "hamstrings" },
      { name: "Икроножные", slug: "calves" },
      { name: "Ягодичные", slug: "glutes" },
      { name: "Пресс", slug: "abs" },
    ],
  });
  console.log("✅ Добавлены группы мышц");

  console.log("🏋️ Создаём упражнения...");

  const exerciseCategory = await prisma.category.findUnique({
    where: { slug: "exercises" },
  });

  const muscleGroups = await prisma.muscleGroup.findMany();
  const getMuscleGroupId = (slug: string) => {
    return muscleGroups.find((mg) => mg.slug === slug)?.id;
  };

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
          name: "Жим гантелей на наклонной скамье",
          description: "Упражнение для верхней части груди",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
        {
          name: "Отжимания от пола",
          description: "Базовое упражнение для грудных мышц, трицепсов и плеч",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
        {
          name: "Сгибание рук с гантелями",
          description: "Изолирующее упражнение на бицепс",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
        {
          name: "Французский жим лёжа",
          description: "Изолирующее упражнение на трицепс",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
        {
          name: "Жим гантелей сидя",
          description: "Упражнение для дельт",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
        {
          name: "Махи гантелями в стороны",
          description: "Упражнение для средней дельты",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
        {
          name: "Становая тяга",
          description: "Упражнение для всего тела, проработка спины и ног",
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
          name: "Тяга штанги в наклоне",
          description: "Базовое упражнение на спину",
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
          name: "Румынская тяга",
          description: "Упражнение на бицепс бедра и ягодицы",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
        {
          name: "Выпады с гантелями",
          description: "Упражнение для ног и ягодиц",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
        {
          name: "Скручивания на пресс",
          description: "Базовое упражнение на пресс",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
        {
          name: "Планка",
          description: "Статическое упражнение на пресс и кор",
          videoUrl: "",
          categoryId: exerciseCategory.id,
        },
      ],
    });
    console.log("✅ Добавлены упражнения");

    console.log("🔗 Привязываем упражнения к группам мышц...");

    const createdExercises = await prisma.exercise.findMany();

    const exerciseMuscleMap = [
      { name: "Жим лёжа", muscleSlugs: ["chest", "front-delt", "triceps"] },
      {
        name: "Жим гантелей на наклонной скамье",
        muscleSlugs: ["chest", "front-delt"],
      },
      {
        name: "Отжимания от пола",
        muscleSlugs: ["chest", "triceps", "front-delt", "abs"],
      },
      { name: "Сгибание рук с гантелями", muscleSlugs: ["biceps"] },
      { name: "Французский жим лёжа", muscleSlugs: ["triceps"] },
      { name: "Жим гантелей сидя", muscleSlugs: ["side-delt", "front-delt"] },
      { name: "Махи гантелями в стороны", muscleSlugs: ["side-delt"] },
      {
        name: "Становая тяга",
        muscleSlugs: ["lats", "lower-back", "hamstrings", "glutes", "traps"],
      },
      { name: "Подтягивания", muscleSlugs: ["lats", "biceps", "traps"] },
      {
        name: "Тяга штанги в наклоне",
        muscleSlugs: ["lats", "traps", "biceps"],
      },
      {
        name: "Приседания со штангой",
        muscleSlugs: ["quads", "glutes", "hamstrings"],
      },
      {
        name: "Румынская тяга",
        muscleSlugs: ["hamstrings", "glutes", "lower-back"],
      },
      {
        name: "Выпады с гантелями",
        muscleSlugs: ["quads", "glutes", "hamstrings"],
      },
      { name: "Скручивания на пресс", muscleSlugs: ["abs"] },
      { name: "Планка", muscleSlugs: ["abs", "front-delt"] },
    ];

    const connections: { exerciseId: number; muscleGroupId: number }[] = [];

    for (const item of exerciseMuscleMap) {
      const exercise = createdExercises.find((e) => e.name === item.name);
      if (!exercise) continue;

      for (const slug of item.muscleSlugs) {
        const muscleId = getMuscleGroupId(slug);
        if (muscleId) {
          connections.push({
            exerciseId: exercise.id,
            muscleGroupId: muscleId,
          });
        }
      }
    }

    if (connections.length > 0) {
      const values = connections
        .map((c) => `(${c.exerciseId}, ${c.muscleGroupId})`)
        .join(", ");

      await prisma.$executeRawUnsafe(`
        INSERT INTO "_ExerciseToMuscleGroup" ("A", "B")
        VALUES ${values}
        ON CONFLICT DO NOTHING
      `);

      console.log(
        `✅ Привязаны упражнения к группам мышц (${connections.length} связей)`,
      );
    }
  }

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

  console.log("💊 Создаём спортивное питание...");

  const supplementCategory = await prisma.category.findUnique({
    where: { slug: "supplements" },
  });

  if (supplementCategory) {
    await prisma.supplement.createMany({
      data: [
        {
          name: "Whey Protein Gold Standard",
          description:
            "Сывороточный протеин с высоким содержанием белка. Отлично подходит для набора мышечной массы и восстановления после тренировок.",
          imageUrl: "https://example.com/whey-protein.jpg",
          price: 3990,
          weight: "900г",
          flavor: "Шоколад",
          brand: "Optimum Nutrition",
          categoryId: supplementCategory.id,
        },
        {
          name: "Creatine Monohydrate",
          description:
            "Креатин моногидрат для повышения силы, выносливости и набора мышечной массы.",
          imageUrl: "https://example.com/creatine.jpg",
          price: 1990,
          weight: "300г",
          flavor: null,
          brand: "MyProtein",
          categoryId: supplementCategory.id,
        },
        {
          name: "BCAA 2:1:1",
          description:
            "Аминокислоты с разветвлённой цепью для защиты мышц от катаболизма и улучшения восстановления.",
          imageUrl: "https://example.com/bcaa.jpg",
          price: 2490,
          weight: "200г",
          flavor: "Манго",
          brand: "Scitec Nutrition",
          categoryId: supplementCategory.id,
        },
        {
          name: "L-Glutamine",
          description:
            "L-глутамин для ускорения восстановления и укрепления иммунитета.",
          imageUrl: "https://example.com/glutamine.jpg",
          price: 1490,
          weight: "250г",
          flavor: null,
          brand: "Olimp",
          categoryId: supplementCategory.id,
        },
        {
          name: "Casein Protein",
          description:
            "Казеиновый протеин с медленным усвоением. Идеально подходит для приёма перед сном.",
          imageUrl: "https://example.com/casein.jpg",
          price: 4290,
          weight: "900г",
          flavor: "Ваниль",
          brand: "Dymatize",
          categoryId: supplementCategory.id,
        },
      ],
    });
    console.log("✅ Добавлены товары спортивного питания");
  }

  console.log("⭐ Добавляем избранное для пользователей...");

  const users = await prisma.user.findMany();
  const user = users.find((u) => u.email === "user@example.com");
  const admin = users.find((u) => u.email === "admin@example.com");

  const exercises = await prisma.exercise.findMany();
  const programs = await prisma.program.findMany();
  const meals = await prisma.meal.findMany();
  const coachings = await prisma.coaching.findMany();
  const supplements = await prisma.supplement.findMany();

  console.log(
    `📊 Найдено: упражнений ${exercises.length}, программ ${programs.length}, блюд ${meals.length}, коучинга ${coachings.length}, спортивного питания ${supplements.length}`,
  );

  if (user) {
    const favoritesData = [];

    if (exercises.length > 0) {
      favoritesData.push(
        { userId: user.id, exerciseId: exercises[0].id },
        { userId: user.id, exerciseId: exercises[2]?.id || exercises[0].id },
      );
    }

    if (programs.length > 0) {
      favoritesData.push({ userId: user.id, programId: programs[0].id });
    }

    if (meals.length > 0) {
      favoritesData.push(
        { userId: user.id, mealId: meals[1]?.id || meals[0].id },
        { userId: user.id, mealId: meals[3]?.id || meals[0].id },
      );
    }

    if (coachings.length > 0) {
      favoritesData.push({ userId: user.id, coachingId: coachings[0].id });
    }

    if (supplements.length > 0) {
      favoritesData.push(
        { userId: user.id, supplementId: supplements[0].id },
        {
          userId: user.id,
          supplementId: supplements[1]?.id || supplements[0].id,
        },
      );
    }

    if (favoritesData.length > 0) {
      await prisma.favorite.createMany({
        data: favoritesData,
        skipDuplicates: true,
      });
      console.log(
        `✅ Добавлено избранное для пользователя ${user.email} (${favoritesData.length} записей)`,
      );
    }
  }

  if (admin) {
    const favoritesData = [];

    if (exercises.length > 0) {
      favoritesData.push(
        { userId: admin.id, exerciseId: exercises[1]?.id || exercises[0].id },
        { userId: admin.id, exerciseId: exercises[3]?.id || exercises[0].id },
      );
    }

    if (programs.length > 0) {
      favoritesData.push({
        userId: admin.id,
        programId: programs[1]?.id || programs[0].id,
      });
    }

    if (meals.length > 0) {
      favoritesData.push({ userId: admin.id, mealId: meals[0].id });
    }

    if (coachings.length > 0) {
      favoritesData.push({
        userId: admin.id,
        coachingId: coachings[1]?.id || coachings[0].id,
      });
    }

    if (supplements.length > 0) {
      favoritesData.push({
        userId: admin.id,
        supplementId: supplements[3]?.id || supplements[0].id,
      });
    }

    if (favoritesData.length > 0) {
      await prisma.favorite.createMany({
        data: favoritesData,
        skipDuplicates: true,
      });
      console.log(
        `✅ Добавлено избранное для администратора ${admin.email} (${favoritesData.length} записей)`,
      );
    }
  }

  console.log("🌱 Сидирование завершено!");
}

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
