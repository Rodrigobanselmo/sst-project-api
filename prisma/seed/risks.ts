import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';

export const seedRisks = async (prisma: PrismaClient, companyId: string) => {
  const ids = [
    '1760cde8-60c2-4bfc-b579-bad8f22fd801',
    'c6ac6dd4-641e-4520-97b1-83b3d83b336c',
    'd02d680e-59b8-42d0-8bb7-a13afbd2cd7f',
    'd7a78bb7-26b1-47d5-91ff-d3fee1dba80f',
    '5eedaa11-c542-4e30-b992-ddda5e07bb4a',
  ];

  await prisma.riskFactors.createMany({
    data: [
      {
        id: ids[0],
        companyId: companyId,
        name: 'Todos',
        system: true,
        type: 'ACI',
        representAll: true,
        severity: 0,
      },
      {
        id: ids[1],
        companyId: companyId,
        name: 'Todos',
        system: true,
        representAll: true,
        type: 'BIO',
        severity: 0,
      },
      {
        id: ids[2],
        companyId: companyId,
        name: 'Todos',
        system: true,
        type: 'QUI',
        representAll: true,
        severity: 0,
      },
      {
        id: ids[3],
        companyId: companyId,
        name: 'Todos',
        representAll: true,
        system: true,
        type: 'FIS',
        severity: 0,
      },
      {
        id: ids[4],
        companyId: companyId,
        name: 'Todos',
        system: true,
        type: 'ERG',
        representAll: true,
        severity: 0,
      },
      {
        companyId: companyId,
        name: 'Todos',
        system: true,
        type: 'OTH',
        representAll: true,
        severity: 0,
      },
    ],
  });

  await Promise.all(
    ids.map(
      async (_id) =>
        await prisma.recMed.createMany({
          data: [
            {
              id: v4(),
              companyId: companyId,
              system: true,
              riskId: _id,
              recName: 'Manter os controles já existentes',
            },
          ],
        }),
    ),
  );

  const recMed = ['Não aplicável', 'Não identificada', 'Não informada'];
  await Promise.all(
    ids.map(async (id) => {
      await Promise.all(
        recMed.map(
          async (rec) =>
            await prisma.recMed.createMany({
              data: [
                {
                  id: v4(),
                  companyId: companyId,
                  system: true,
                  riskId: id,
                  medName: rec,
                  medType: 'ADM',
                },
                {
                  id: v4(),
                  companyId: companyId,
                  system: true,
                  riskId: id,
                  medName: rec,
                  medType: 'ENG',
                },
                {
                  id: v4(),
                  companyId: companyId,
                  system: true,
                  riskId: id,
                  recName: rec,
                },
              ],
            }),
        ),
      );
    }),
  );
};
