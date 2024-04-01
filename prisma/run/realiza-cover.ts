import { asyncEach } from '../../src/shared/utils/asyncEach';
import { PrismaClient } from '@prisma/client';
import { arrayChunks } from '../../src/shared/utils/arrayChunks';

const realizaId = '7afc3b79-f001-4587-aa21-062d2fb37f6a';
const jsonCover = {
  coverProps: {
    logoProps: { maxLogoHeight: 141, y: 78, maxLogoWidth: 212, x: 210 },
    backgroundImagePath: 'images/cover/realiza.png',
    titleProps: {
      x: 163,
      y: 310,
      boxX: 464,
      boxY: 0,
      size: 28,
      color: 'FFFFFF',
    },
    versionProps: {
      x: 163,
      y: 480,
      boxX: 464,
      boxY: 0,
      color: 'FFFFFF',
      size: 14,
    },
    companyProps: {
      x: 163,
      y: 510,
      boxX: 464,
      boxY: 0,
      color: 'FFFFFF',
      size: 14,
    },
  },
};

export const realizaCover = async (prisma: PrismaClient) => {
  await prisma.documentCover.create({
    data: {
      json: jsonCover,
      companyId: realizaId,
    },
  });
  // const realiza = await prisma.documentCover.findFirst({
  //   where: { companyId: realizaId },
  // });
  // await prisma.documentCover.update({
  //   data: {
  //     json: jsonCover,
  //     companyId: realizaId,
  //   },
  //   where: { id: realiza.id },
  // });
};
