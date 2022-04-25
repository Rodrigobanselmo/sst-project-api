import { PrismaClient } from '@prisma/client';
import { Permission, Role } from '../src/shared/constants/enum/authorization';
import { hash } from 'bcrypt';
import { v4 } from 'uuid';

const prisma = new PrismaClient();

const createUserAndCompany = async () => {
  const id =
    process.env.NODE_ENV === 'test'
      ? '1'
      : 'b8635456-334e-4d6e-ac43-cfe5663aee17';

  const workId = v4();

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
          id: workId,
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
            {
              name: 'DIRECTORY',
              type: 'DIRECTORY',
              id: 'a',
              workplaceId: workId,
            },
            {
              name: 'MANAGEMENT',
              type: 'MANAGEMENT',
              id: 'b',
              parentId: 'a',
              workplaceId: workId,
            },
            {
              name: 'SECTOR',
              type: 'SECTOR',
              id: 'c',
              parentId: 'b',
              workplaceId: workId,
            },
            {
              name: 'OFFICE 1',
              type: 'OFFICE',
              id: 'd',
              parentId: 'c',
              workplaceId: workId,
            },
            {
              name: 'OFFICE 2',
              type: 'OFFICE',
              id: 'e',
              parentId: 'c',
              workplaceId: workId,
            },
            {
              name: 'SUB_OFFICE',
              type: 'SUB_OFFICE',
              id: 'f',
              parentId: 'd',
              workplaceId: workId,
            },
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
            connect: { id: 'f' },
          },
        },
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const risks = await prisma.riskFactors.createMany({
    data: [
      {
        id: v4(),
        companyId: company.id,
        name: 'Todos',
        system: true,
        type: 'ACI',
        representAll: true,
        severity: 0,
      },
      {
        id: v4(),
        companyId: company.id,
        name: 'Todos',
        system: true,
        representAll: true,
        type: 'BIO',
        severity: 0,
      },
      {
        id: v4(),
        companyId: company.id,
        name: 'Todos',
        system: true,
        type: 'QUI',
        representAll: true,
        severity: 0,
      },
      {
        id: v4(),
        companyId: company.id,
        name: 'Todos',
        representAll: true,
        system: true,
        type: 'FIS',
        severity: 0,
      },
      {
        id: v4(),
        companyId: company.id,
        name: 'Todos',
        system: true,
        type: 'ERG',
        representAll: true,
        severity: 0,
      },
    ],
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
