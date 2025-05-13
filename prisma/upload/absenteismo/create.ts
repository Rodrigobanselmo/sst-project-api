import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';
import { asyncBatch } from '../../../src/shared/utils/asyncBatch';
import dayjs from 'dayjs';

//npx ts-node prisma/upload/absenteismo/create.ts

const prisma = new PrismaClient();
const companyId = '4a9538bf-be7a-4cc2-9f34-09fe0d486305';

type AbsenceData = {
  matricula: string;
  nomeCompleto: string;
  motivo: number;
  dataInicio: Date;
  dataFim: Date;
  dias: number;
};

// Function to read, modify, and save the JSON data
async function processJsonFile(outputFilePath: string): Promise<void> {
  const rawData = await fs.readFile(outputFilePath, 'utf-8');
  // const jsonData: AbsenceData[] = [
  //   {
  //     dataFim: new Date('2021-01-01'),
  //     dataInicio: new Date('2021-01-01'),
  //     dias: 1,
  //     matricula: '1',
  //     motivo: 2,
  //     nomeCompleto: 'Teste Anselmo',
  //   },
  // ];
  const jsonData: AbsenceData[] = JSON.parse(rawData);

  const employeeData = new Set<string>();
  const employeeDataFound = new Set<string>();

  await asyncBatch(jsonData, 100, async (record) => {
    let employee = await prisma.employee.findFirst({
      where: {
        companyId,
        OR: [
          { esocialCode: record.matricula },
          {
            name: {
              mode: 'insensitive',
              equals: record.nomeCompleto
                .normalize('NFD')
                .replace(/\p{Diacritic}/gu, '')
                .trim(),
            },
          },
        ],
      },
    });

    if (!employee && !employeeData.has(record.matricula)) {
      employeeData.add(record.matricula);

      employee = await prisma.employee.create({
        data: {
          companyId,
          cpf: record.matricula.padStart(11, '0'),
          name: record.nomeCompleto
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .trim(),
          esocialCode: record.matricula,
        },
      });

      console.log(
        `${record.matricula};${record.nomeCompleto
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .trim()}`,
      );
    }

    if (employee) {
      employeeDataFound.add(record.matricula);

      const startDate = dayjs(new Date(record.dataInicio));
      const endDate = dayjs(new Date(record.dataFim));

      const timeSpent = startDate.diff(endDate, 'minutes');
      const daysSpent = startDate.diff(endDate, 'days');

      await prisma.absenteeism.create({
        data: {
          employeeId: employee.id,
          timeSpent,
          startDate: new Date(record.dataInicio),
          endDate: new Date(record.dataFim),
          observation: 'Importado por planilha',
          timeUnit: 'DAY',
          motiveId: record.motivo || (Math.abs(daysSpent) > 15 ? 15 : 2),
        },
      });
    }
  });

  console.log('Employee size:', employeeData.size);
  console.log('Employee found size:', employeeDataFound.size);
  // Employee size: 132
  // Employee found size: 143
}

async function main() {
  console.log('Processing JSON data...');
  const outputFilePath = path.join(__dirname, 'output.json'); // Replace with your input file path

  await processJsonFile(outputFilePath);
}

main();
//npx ts-node prisma/upload/absenteismo/create.ts
