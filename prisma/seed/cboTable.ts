import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { asyncBatch } from '../../src/shared/utils/asyncBatch';

export const cboTable = async (prisma: PrismaClient) => {
  try {
    const data = fs.readFileSync('prisma/seed/json/cbo.txt', 'utf8');

    const json = data
      .toString()
      .split('\n')
      .filter((i) => i)
      .map((v) => {
        const splitValue = v.split(' || ');
        const code = splitValue[0];
        const desc = splitValue[1];

        return {
          code: code,
          desc: desc,
        };
      });

    await asyncBatch(json, 50, async (data: any) => {
      console.count();

      const code = String(data.code).padStart(6, '0');

      await prisma.cbo.upsert({
        create: { code, desc: data.desc },
        update: { code, desc: data.desc },
        where: { code_desc: { code, desc: data.desc } },
      });
    });

    return;
  } catch (e) {
    console.log('Error:', e.stack);
  }
};
