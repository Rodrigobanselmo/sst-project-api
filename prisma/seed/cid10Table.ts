import { PrismaClient } from '@prisma/client';
import fs from 'fs';

import { asyncBatch } from '../../src/shared/utils/asyncBatch';

export const cid10Table = async (prisma: PrismaClient) => {
  try {
    const data15 = fs.readFileSync('prisma/seed/json/cid10.json', 'utf8');
    const data15Json = JSON.parse(data15);

    await asyncBatch(data15Json, 10, async (data: any) => {
      await prisma.cid.upsert({
        create: {
          cid: data.code,
          description: data.desc,
          ...(data.sex && { sex: data.sex }),
          ...(data.class && { class: data.class }),
          ...(data.kill != 'N' && { kill: true }),
        },
        update: {
          cid: data.code,
          description: data.desc,
          ...(data.sex && { sex: data.sex }),
          ...(data.class && { class: data.class }),
          ...(data.kill != 'N' && { kill: true }),
        },
        where: { cid: data.code },
      });
    });

    return;
  } catch (e) {
    console.error('Error:', e.stack);
  }
};
