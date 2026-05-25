import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/generated/prisma-client/client.js';

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5432/build_log';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const workTypes = [
  'Кладка перегородок',
  'Монтаж опалубки',
  'Армирование',
  'Бетонирование',
  'Штукатурные работы',
];

const measurementUnits = [
  { name: 'штука', symbol: 'шт' },
  { name: 'квадратный метр', symbol: 'м2' },
  { name: 'кубический метр', symbol: 'м3' },
  { name: 'погонный метр', symbol: 'п.м.' },
];

async function main() {
  for (const name of workTypes) {
    await prisma.workType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const unit of measurementUnits) {
    await prisma.measurementUnit.upsert({
      where: { name: unit.name },
      update: { symbol: unit.symbol },
      create: unit,
    });
  }
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
