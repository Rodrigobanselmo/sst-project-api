import { PrismaClient } from '@prisma/client';
import { deleteCompany } from './run/delete-company';

const prisma = new PrismaClient();

async function main() {
  console.log('start');
  try {
    // await prisma.license.create({
    //   data: {
    //     companyId: '6527c27e-949a-4888-a784-ac4e4b19ed0c',
    //     companies: { connect: { id: 'd1309cad-19d4-4102-9bf9-231f91095c20' } },
    //   },
    // });
    await deleteCompany('c9e42b34-2b6c-4f4f-ae00-59832ff22341', prisma);
    await deleteCompany('baa8c370-4e7a-47f2-a9dc-4dd7175e7fcc', prisma);
    await deleteCompany('8d0da9db-4667-4432-95a8-36c12fafc40f', prisma);
    await deleteCompany('7fbdf94f-90e8-4030-a9bb-ce4c896ab6de', prisma);
  } catch (error) {
    console.log(error);
    console.log('error: end');
  }
  console.log('end');
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
