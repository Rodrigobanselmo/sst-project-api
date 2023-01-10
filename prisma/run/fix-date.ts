import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const fixDate = async (prisma: PrismaClient) => {
  const examsClinic = await prisma.examToClinic.findMany({ select: { id: true, startDate: true, endDate: true } });

  Promise.all(
    examsClinic.map(async (ec) => {
      const sH = dayjs(ec.startDate).hour() != 0;
      const eH = dayjs(ec.endDate).hour() != 0;
      if (sH || eH) {
        await prisma.examToClinic.update({
          where: { id: ec.id },
          data: { ...(sH && { startDate: dayjs(ec.startDate).add(3, 'h').toDate() }), ...(eH && { endDate: dayjs(ec.endDate).add(3, 'h').toDate() }) },
        });
      }
    }),
  );
};
