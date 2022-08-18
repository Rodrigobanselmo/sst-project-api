import { asyncEach } from '../../src/shared/utils/asyncEach';
import { PrismaClient } from '@prisma/client';
import { arrayChunks } from '../../src/shared/utils/arrayChunks';

const connapaId = '6527c27e-949a-4888-a784-ac4e4b19ed0c';
const jsonCover = {
  coverProps: {
    logoProps: { maxLogoHeight: 141, y: 78, maxLogoWidth: 212, x: 210 },
    backgroundImagePath: 'images/cover/connapa.jpeg',
    titleProps: {
      x: 163,
      y: 310,
      boxX: 464,
      boxY: 0,
      size: 28,
    },
    versionProps: {
      x: 163,
      y: 480,
      boxX: 464,
      boxY: 0,
      size: 14,
    },
    companyProps: {
      x: 163,
      y: 510,
      boxX: 464,
      boxY: 0,
      size: 14,
    },
  },
};

export const connapaCover = async (prisma: PrismaClient) => {
  await prisma.documentCover.create({
    data: {
      json: jsonCover,
      companyId: connapaId,
    },
  });
};
