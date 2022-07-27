import { PrismaClient } from '@prisma/client';
import { convertEpi } from './run/convert-epi';
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
    // await deleteCompany('4c8c2000-c70c-4285-992d-26d7d8f683cb', prisma);
    //? trocar env to char
    convertEpi(prisma);
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
