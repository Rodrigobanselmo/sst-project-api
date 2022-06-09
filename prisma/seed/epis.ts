import { PrismaClient } from '@prisma/client';

export const seedEpis = async (prisma: PrismaClient) => {
  const equipments = ['Não aplicável', 'Não identificado', 'Não informado'];

  equipments.map(
    async (equipment, index) =>
      await prisma.epi.create({
        data: {
          ca: String(index),
          equipment,
          description: 'NA',
        },
      }),
  );
};
