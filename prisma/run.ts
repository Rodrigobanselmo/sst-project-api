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
    // await prisma.userCompany.deleteMany({
    //   where: { user: { email: 'marcelo.alves@grupoevicon.com.br' } },
    // });
    // await deleteCompany('be0953c9-37d5-4115-9589-ecae8f38226e', prisma);
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
