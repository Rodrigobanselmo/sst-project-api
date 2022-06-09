import { PrismaClient } from '@prisma/client';

export const seedEmployees = async (
  prisma: PrismaClient,
  companyId: string,
  workId: string,
) => {
  await prisma.hierarchy.createMany({
    data: [
      {
        name: 'Presidência',
        type: 'DIRECTORY',
        id: 'a',
        companyId: companyId,
      },
      {
        name: 'Gerente',
        type: 'MANAGEMENT',
        id: 'b',
        parentId: 'a',
        companyId: companyId,
      },
      {
        name: 'Tecnologia',
        type: 'SECTOR',
        id: 'c',
        parentId: 'b',
        companyId: companyId,
      },
      {
        name: 'Médicina ocupacional',
        type: 'SECTOR',
        id: 'f',
        parentId: 'b',
        companyId: companyId,
      },
      {
        name: 'Engenheiro de Segurança',
        type: 'OFFICE',
        id: 'd',
        parentId: 'f',
        companyId: companyId,
      },
      {
        name: 'Engenheiro de Software',
        type: 'OFFICE',
        id: 'e',
        parentId: 'c',
        companyId: companyId,
      },
    ],
  });

  await prisma.company.update({
    where: { id: companyId },
    include: { employees: true },
    data: {
      employees: {
        create: [
          {
            cpf: '123456789',
            name: 'Alex Abreu Marins',
            workspace: {
              connect: {
                id_companyId: { companyId: companyId, id: workId },
              },
            },
            hierarchy: {
              connect: { id: 'f' },
            },
          },
          {
            cpf: '123456789',
            name: 'Rodrigo Barbosa Anselmo',
            workspace: {
              connect: {
                id_companyId: { companyId: companyId, id: workId },
              },
            },
            hierarchy: {
              connect: { id: 'e' },
            },
          },
        ],
      },
    },
  });
};
