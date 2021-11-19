import { PrismaClient } from '@prisma/client';
import { Permission, Role } from '../src/shared/constants/authorization';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

const createUserAndCompany = async () => {
  const company = await prisma.company.create({
    data: {
      cnpj: '10000000000',
      fantasy: 'Simple',
      name: 'Simplesst LTDA',
      status: 'Ativo',
      type: 'Matriz',
    },
  });

  const passwordHash = await hash('12345678', 10);

  await prisma.user.create({
    data: {
      email: 'admin@simple.com',
      password: passwordHash,
      companies: {
        create: [
          {
            companyId: company.id,
            roles: [Role.MASTER],
            permissions: [Permission.MASTER],
          },
        ],
      },
    },
  });
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
