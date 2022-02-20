import { PrismaClient } from '@prisma/client';
import { Permission, Role } from '../src/shared/constants/enum/authorization';
import { hash } from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

const prisma = new PrismaClient();

const createUserAndCompany = async () => {
  const id = process.env.NODE_ENV === 'test' ? '1' : uuidV4();
  const company = await prisma.company.create({
    data: {
      id,
      cnpj: '10000000000',
      fantasy: 'Simple',
      name: 'Simplesst LTDA',
      status: 'ACTIVE',
      type: 'MASTER',
      license: { create: { companyId: id } },
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
