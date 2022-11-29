import { PrismaClient, RiskFactorsEnum } from '@prisma/client';
import fs from 'fs';
import { asyncBatch } from '../../src/shared/utils/asyncBatch';

export const motiveTables = async (prisma: PrismaClient) => {
  try {
    const dataMotive = fs.readFileSync('prisma/seed/json/motive.txt', 'utf8');

    const jsonMotive = dataMotive
      .toString()
      .split('\n')
      .filter((i) => !i.includes('--'))
      .filter((i) => i)
      .map((v) => {
        return {
          desc: v,
        };
      });
    await asyncBatch(jsonMotive, 50, async (data: any) => {
      console.log('jsonMotive');
      console.count();

      await prisma.absenteeismMotive.create({
        data: { desc: data.desc },
      });
    });
  } catch (e) {
    console.log('Error:', e.stack);
  }
};
