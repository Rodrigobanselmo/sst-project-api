import { asyncBatch } from '../../src/shared/utils/asyncBatch';
import { PrismaClient } from '@prisma/client';

export const emptyDocTables = async (prisma: PrismaClient) => {
  await prisma.attachments.deleteMany();
  // await prisma.documentDataToProfessional.deleteMany();
  // await prisma.documentData.deleteMany();
  await prisma.riskFactorDocument.deleteMany();
};
