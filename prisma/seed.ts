import { PrismaClient } from '@prisma/client';
import {
  PermissionEnum,
  RoleEnum,
} from '../src/shared/constants/enum/authorization';
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
          name: 'MATRIZ',
          abbreviation: 'MA',
          id: workId,
          address: { create: { cep: '12246-000' } },
        },
      },
    },
    include: { workspace: true },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const hierarchy = await prisma.hierarchy.createMany({
  //   data: [
  //     {
  //       name: 'Presidência',
  //       type: 'DIRECTORY',
  //       id: 'a',
  //       companyId: id,
  //     },
  //     {
  //       name: 'Gerente',
  //       type: 'MANAGEMENT',
  //       id: 'b',
  //       parentId: 'a',
  //       workspaceId: workId,
  //     },
  //     {
  //       name: 'Tecnologia',
  //       type: 'SECTOR',
  //       id: 'c',
  //       parentId: 'b',
  //       workspaceId: workId,
  //     },
  //     {
  //       name: 'Médicina ocupacional',
  //       type: 'SECTOR',
  //       id: 'f',
  //       parentId: 'b',
  //       workspaceId: workId,
  //     },
  //     {
  //       name: 'Engenheiro de Segurança',
  //       type: 'OFFICE',
  //       id: 'd',
  //       parentId: 'f',
  //       workspaceId: workId,
  //     },
  //     {
  //       name: 'Engenheiro de Software',
  //       type: 'OFFICE',
  //       id: 'e',
  //       parentId: 'c',
  //       workspaceId: workId,
  //     },
  //   ],
  // });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const employees = await prisma.company.update({
  //   where: { id },
  //   include: { employees: true },
  //   data: {
  //     employees: {
  //       create: [
  //         {
  //           cpf: '123456789',
  //           name: 'Alex Abreu Marins',
  //           workspace: {
  //             connect: {
  //               id_companyId: { companyId: id, id: company.workspace[0].id },
  //             },
  //           },
  //           hierarchy: {
  //             connect: { id: 'f' },
  //           },
  //         },
  //         {
  //           cpf: '123456789',
  //           name: 'Rodrigo Barbosa Anselmo',
  //           workspace: {
  //             connect: {
  //               id_companyId: { companyId: id, id: company.workspace[0].id },
  //             },
  //           },
  //           hierarchy: {
  //             connect: { id: 'e' },
  //           },
  //         },
  //       ],
  //     },
  //   },
  // });

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
            roles: [RoleEnum.MASTER],
            permissions: [PermissionEnum.MASTER],
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
