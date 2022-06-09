import { PrismaClient } from '@prisma/client';

import { seedCompany } from './seed/company';
import { seedEmployees } from './seed/employees';
import { seedEpis } from './seed/epis';
import { seedRisks } from './seed/risks';
import { seedUsers } from './seed/user';

const prisma = new PrismaClient();

const createUserAndCompany = async () => {
  const { companyId, workId } = await seedCompany(prisma);
  await seedEmployees(prisma, companyId, workId);
  await seedRisks(prisma, companyId);
  await seedUsers(prisma, companyId);
  await seedEpis(prisma);
};

async function main() {
  await createUserAndCompany();
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
