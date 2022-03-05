import { PrismaClient } from '@prisma/client';
import { Permission, Role } from '../src/shared/constants/enum/authorization';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

const createUserAndCompany = async () => {
  const id =
    process.env.NODE_ENV === 'test'
      ? '1'
      : 'b8635456-334e-4d6e-ac43-cfe5663aee17';

  const company = await prisma.company.create({
    data: {
      id,
      cnpj: '07.689.002/0001-89',
      fantasy: 'Simple',
      name: 'Simplesst LTDA',
      status: 'ACTIVE',
      type: 'MASTER',
      license: { create: { companyId: id } },
      workspace: {
        create: {
          name: 'Workspace',
          address: { create: { cep: '12246-000' } },
        },
      },
    },
    include: { workspace: true },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hierarchy = await prisma.company.update({
    where: { id },
    include: { employees: true, hierarchy: true },
    data: {
      hierarchy: {
        createMany: {
          data: [
            { name: 'DIRECTORY', type: 'DIRECTORY', id: 1 },
            { name: 'MANAGEMENT', type: 'MANAGEMENT', id: 2, parentId: 1 },
            { name: 'SECTOR', type: 'SECTOR', id: 3, parentId: 2 },
            { name: 'OFFICE 1', type: 'OFFICE', id: 4, parentId: 3 },
            { name: 'OFFICE 2', type: 'OFFICE', id: 5, parentId: 3 },
            { name: 'SUB_OFFICE', type: 'SUB_OFFICE', id: 6, parentId: 4 },
          ],
        },
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const employees = await prisma.company.update({
    where: { id },
    include: { employees: true },
    data: {
      employees: {
        create: {
          cpf: '123456789',
          name: 'Employee',
          workplace: {
            connect: {
              id_companyId: { companyId: id, id: company.workspace[0].id },
            },
          },
          hierarchy: {
            connect: { id_companyId: { companyId: id, id: 6 } },
          },
        },
      },
    },
  });

  const passwordHash = await hash('aaaa0123', 10);

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
