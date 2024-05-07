import { GrauInsalubridade, PrismaClient } from '@prisma/client';
import { asyncBatch } from 'src/shared/utils/asyncBatch';

export const removeRisk = async (prisma: PrismaClient) => {
  await prisma.riskFactorData.updateMany({
    where: {
      riskFactor: {
        name: { contains: '00DELETAR' }
      }
    },
    data: {
      riskId: 'c99f3651-a0f4-4607-be0d-9f7a426cb9a2'
    }
  });

  await prisma.riskFactors.deleteMany({
    where: {
      name: { contains: '00DELETAR' }
    },
  });

  const risks = await prisma.riskFactors.findMany({
    select: {
      id: true, name: true,
      appendix: true,
    }
  });

  await prisma.riskFactors.updateMany({
    where: {
      appendix: { in: ['', '-'] }
    }, data: {
      appendix: null
    }
  });



  function extractAcgh(input: string): string | null {
    if (!input) return null;

    const regex = /\[ACGIH-(.+?)\]/;
    const match = input.match(regex);
    return match ? match[1] : null;
  }
  function extractNr(input: string): string | null {
    if (!input) return null;

    const regex = /\[NR15-(.+?)\]/;
    const match = input.match(regex);
    return match ? match[1] : null;
  }

  asyncBatch(risks, 50, async (risk) => {
    const nameSplit = risk.name.split(';;');
    const achgName = extractAcgh(nameSplit.find((a) => a.includes('ACGIH')));
    const nr15Name = extractNr(nameSplit.find((a) => a.includes('NR15')));
    const synonms = nameSplit.filter((a, index) => !a.includes('ACGIH') && !a.includes('NR15') && index !== 0);

    const appendixSplit = risk?.appendix?.split(', ')||[];
    const appendix = appendixSplit.find((a) => !isNaN(Number(a)));
    const otherAppendix = appendixSplit.find((a) => a == 'ACGIH');

    const grau = appendixSplit.find((a) => a.includes('Grau'));
    const grauEnum = grau?.includes('Mínimo') ? GrauInsalubridade.MIN : grau?.includes('Médio') ? GrauInsalubridade.MED : grau?.includes('Máximo') ? GrauInsalubridade.MAX : null;

    await prisma.riskFactors.update({
      where: { id: risk.id, },
      data: {
        appendix: appendix || null,
        otherAppendix: otherAppendix || null,
        grauInsalubridade: grauEnum || null,
        name: nameSplit[0],
        synonymous: synonms ? { set: synonms } : undefined,
        ...((!!achgName || !!nr15Name) && {
          json: {
            rsdata: {
              ...(!!achgName && {
                acgh: { name: achgName },
              }),
              ...(!!nr15Name && {
                nr15: { name: nr15Name },
              }),
            }
          }
        })
      }
    });

  })

};
