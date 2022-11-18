import { PrismaClient, RiskFactorsEnum } from '@prisma/client';
import fs from 'fs';

export const seedEsocial24 = async (prisma: PrismaClient) => {
  try {
    const data = fs.readFileSync('prisma/seed/json/esocial24.txt', 'utf8');

    let group = '';
    const json = data
      .toString()
      .split('\n')
      .map((v) => {
        const isCode = v.slice(0, 1) == '0';
        const num = v.slice(1, 2);
        if (!isCode) {
          group = v;
          return;
        }

        const splitValue = v.split('\t');

        const getType = () => {
          if (num == '1') return RiskFactorsEnum.QUI;
          if (num == '2') return RiskFactorsEnum.FIS;
          if (num == '3') return RiskFactorsEnum.BIO;
          return RiskFactorsEnum.OUTROS;
        };

        return {
          id: splitValue[0],
          name: splitValue[1],
          group,
          type: getType(),
          isQuantity: num == '2',
        };
      });

    console.log(json);
    await Promise.all(
      json
        .filter((i) => i)
        .map(async (j) => {
          await prisma.esocialTable24.upsert({
            create: { ...j },
            update: { ...j },
            where: { id: j.id },
          });
        }),
    );
  } catch (e) {
    console.log('Error:', e.stack);
  }
};
