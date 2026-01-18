import { asyncEach } from '../../src/shared/utils/asyncEach';
import { PrismaClient } from '@prisma/client';
import { arrayChunks } from '../../src/shared/utils/arrayChunks';

const planlinkId = '73914bc5-91af-4236-84f2-b76c2419fde7';
const jsonCover = {
  coverProps: {
    logoProps: { maxLogoHeight: 141, y: 58, maxLogoWidth: 212, x: 200 },
    backgroundImagePath: 'images/cover/planlink.png',
    titleProps: {
      x: 103,
      y: 310,
      boxX: 464,
      boxY: 0,
      size: 28,
      color: 'FFFFFF',
    },
    versionProps: {
      x: 103,
      y: 480,
      boxX: 464,
      boxY: 0,
      color: 'FFFFFF',
      size: 14,
    },
    companyProps: {
      x: 103,
      y: 510,
      boxX: 464,
      boxY: 0,
      color: 'FFFFFF',
      size: 14,
    },
  },
};

export const planlinkCover = async (prisma: PrismaClient) => {
  const planlink = await prisma.documentCover.findFirst({
    where: { companyId: planlinkId },
  });

  await prisma.documentCover.upsert({
    where: { id: planlink?.id ?? 0 },
    update: {
      json: jsonCover,
    },
    create: {
      json: jsonCover,
      companyId: planlinkId,
    },
  });
};

planlinkCover(new PrismaClient());
