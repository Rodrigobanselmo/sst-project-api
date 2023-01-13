import { normalizeString } from './../../src/shared/utils/normalizeString';
import { PrismaClient, RiskFactorsEnum } from '@prisma/client';
import fs from 'fs';
import { asyncBatch } from '../../src/shared/utils/asyncBatch';

export const addEsocialTables = async (prisma: PrismaClient) => {
  try {
    const data13 = fs.readFileSync('prisma/seed/json/esocial13.txt', 'utf8');
    const data14 = fs.readFileSync('prisma/seed/json/esocial14.txt', 'utf8');
    const data17 = fs.readFileSync('prisma/seed/json/esocial17.txt', 'utf8');
    const data18 = fs.readFileSync('prisma/seed/json/esocial18.txt', 'utf8');
    const data20 = fs.readFileSync('prisma/seed/json/esocial20.txt', 'utf8');
    const dataMotive = fs.readFileSync('prisma/seed/json/motive.txt', 'utf8');

    const data15 = fs.readFileSync('prisma/seed/json/esocial15.json', 'utf8');
    const data15Json = JSON.parse(data15);
    const data6 = fs.readFileSync('prisma/seed/json/esocial6.json', 'utf8');
    const data6Json = JSON.parse(data6);
    const uf_cities = fs.readFileSync('prisma/seed/json/uf_cities.json', 'utf8');
    const uf_citiesJson = JSON.parse(uf_cities);

    const json13 = data13
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

    const json14 = data14
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

    const json17 = data17
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

    const json18 = data18
      .toString()
      .split('\n')
      .filter((i) => i)
      .filter((i) => !i.includes(' -- '))
      .map((v) => {
        const splitValue = v.split(' || ');
        const code = splitValue[0];
        const desc = splitValue[1];

        return {
          code: code,
          desc: desc,
        };
      });

    const json20 = data20
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

    await asyncBatch(uf_citiesJson, 50, async (data: any) => {
      if (data.UF_Nome) {
        console.count();
        await prisma.uf.upsert({
          create: { uf: data.UF_Nome, code: String(data.UF), name: data.state },
          update: { uf: data.UF_Nome, code: String(data.UF), name: data.state },
          where: { uf: data.UF_Nome },
        });
      }
    });

    await asyncBatch(uf_citiesJson, 100, async (data: any) => {
      console.count();

      await prisma.cities.upsert({
        create: { ufCode: String(data.UF), code: String(data.code_mun), name: data.mun, normalized: normalizeString(data.mun).toLocaleLowerCase() },
        update: { ufCode: String(data.UF), code: String(data.code_mun), name: data.mun, normalized: normalizeString(data.mun).toLocaleLowerCase() },
        where: { code: String(data.code_mun) },
      });
    });

    await asyncBatch(data6Json, 50, async (data: any) => {
      console.info('data6Json');
      console.count();

      await prisma.esocialTable6Country.upsert({
        create: { code: String(data.code), name: data.name },
        update: { code: String(data.code), name: data.name },
        where: { code: String(data.code) },
      });
    });

    await asyncBatch(json13, 50, async (data: any) => {
      console.info('json13');
      console.count();

      await prisma.esocialTable13BodyPart.upsert({
        create: { code: String(data.code), desc: data.desc },
        update: { code: String(data.code), desc: data.desc },
        where: { code: String(data.code) },
      });
    });

    await asyncBatch(json14, 50, async (data: any) => {
      console.info('json14');
      console.count();

      await prisma.esocialTable14And15Acid.upsert({
        create: { code: String(data.code), desc: data.desc, table: 14 },
        update: { code: String(data.code), desc: data.desc, table: 14 },
        where: { code: String(data.code) },
      });
    });

    await asyncBatch(data15Json, 50, async (data: any) => {
      console.info('data15Json');
      console.count();

      await prisma.esocialTable14And15Acid.upsert({
        create: { code: String(data.id), desc: data.description, table: 15, ...(data?.case && { case: data.case }) },
        update: { code: String(data.id), desc: data.description, table: 15, ...(data?.case && { case: data.case }) },
        where: { code: String(data.id) },
      });
    });

    await asyncBatch(json17, 50, async (data: any) => {
      console.info('json17');
      console.count();

      await prisma.esocialTable17Injury.upsert({
        create: { code: String(data.code), desc: data.desc },
        update: { code: String(data.code), desc: data.desc },
        where: { code: String(data.code) },
      });
    });

    await asyncBatch(json18, 50, async (data: any) => {
      console.info('json18');
      console.count();

      await prisma.esocialTable18Mot.upsert({
        create: { code: String(data.code), description: data.desc },
        update: { code: String(data.code), description: data.desc },
        where: { code: String(data.code) },
      });
    });

    await asyncBatch(json20, 50, async (data: any) => {
      console.info('json20');
      console.count();

      await prisma.esocialTable20Lograd.upsert({
        create: { code: String(data.code), desc: data.desc },
        update: { code: String(data.code), desc: data.desc },
        where: { code: String(data.code) },
      });
    });

    return;
  } catch (e) {
    console.info('Error:', e.stack);
  }
};
