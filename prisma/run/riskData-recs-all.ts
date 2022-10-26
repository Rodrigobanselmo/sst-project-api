import { getMatrizRisk } from '../../src/shared/utils/matriz';
import { asyncEach } from '../../src/shared/utils/asyncEach';
import { PrismaClient } from '@prisma/client';
import { arrayChunks } from '../../src/shared/utils/arrayChunks';

export const riskDataRecsAll = async (prisma: PrismaClient) => {
  const companyIds = [
    'd1309cad-19d4-4102-9bf9-231f91095c20',
    'c615edfb-c68b-4842-863e-17a1b6797932',
    '2b916bb4-1476-41cc-8826-e8bd29f7ba13',
    '0c5c5e82-2c19-46ad-a8de-7615ed039bc4',
    '11bc8263-d1e7-4bfa-bfee-7db30c768a22',
    '79ae200f-85d5-415f-bff3-c8d5b711731f',
    '49e86923-95a9-4d58-9cb4-c55ae12928ed',
    '4be08622-86de-4cd9-b31e-4f9bd92e1203',
  ];

  const riskFactorData = await prisma.riskFactorData.findMany({
    where: {
      companyId: { in: companyIds },
      adms: {
        some: { medName: { in: ['Não identificada', 'Não informada'] } },
      },
    },
    include: {
      adms: {
        select: { id: true },
        where: { medName: { in: ['Não identificada', 'Não informada'] } },
      },
    },
  });

  await Promise.all(
    riskFactorData.map(async (riskData) => {
      await prisma.riskFactorData.update({
        where: { id: riskData.id },
        data: {
          // engsToRiskFactorData: {
          //   upsert: {
          //     create: { recMedId: '345d9e7c-d378-43b9-99b4-99f5865c2631' },
          //     update: {},
          //     where: {
          //       riskFactorDataId_recMedId: {
          //         recMedId: '345d9e7c-d378-43b9-99b4-99f5865c2631',
          //         riskFactorDataId: riskData.id,
          //       },
          //     },
          //   },
          // },
          // adms: { connect: { id: '45ccd313-7c42-443f-b46a-b6b6a5289694' } },
          // recs: {
          //   disconnect: [
          //     ...microPausas.map((id) => ({ id: id })),
          //     // { id: 'f8fb9792-472e-4df6-afed-7799cc023bf2' },
          //   ],
          // },
          adms: { disconnect: riskData.adms.map((d) => ({ id: d.id })) },
          // engsToRiskFactorData: { deleteMany: { rec } },
        },
      });
    }),
  );
};
