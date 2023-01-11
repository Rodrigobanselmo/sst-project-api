import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { dayjs } from '../../src/shared/providers/DateProvider/implementations/DayJSProvider';

interface IHolidaysNationalApiReturn {
  date: string | Date;
  name: string;
  type: string;
}

export const scheduleBlockNational = async (prisma: PrismaClient) => {
  const companyId = '6527c27e-949a-4888-a784-ac4e4b19ed0c';
  try {
    const response = await axios.get<IHolidaysNationalApiReturn[]>(`https://brasilapi.com.br/api/feriados/v1/${new Date().getFullYear()}`);
    if (response.data) {
      const holidays = await prisma.scheduleBlock.findMany({ select: { id: true, name: true }, where: { companyId: companyId, type: 'NAT_HOLIDAY' } });

      Promise.all(
        response.data.map(async (holiday) => {
          const found = holidays.find((databaseHoliday) => holiday.name == databaseHoliday.name);
          const date = dayjs(holiday.date);
          if (found) {
            await prisma.scheduleBlock.update({
              where: { id: found.id },
              data: { startDate: date.format('MM-DD'), endDate: date.format('MM-DD'), startTime: '00:00', endTime: '23:59' },
            });
          } else {
            await prisma.scheduleBlock.create({
              data: {
                companyId,
                name: holiday.name,
                allCompanies: true,
                type: 'NAT_HOLIDAY',
                startDate: date.format('MM-DD'),
                endDate: date.format('MM-DD'),
                startTime: '00:00',
                endTime: '23:59',
                yearRecurrence: true,
              },
            });
          }
        }),
      );
    }
  } catch (error) {
    console.error(error);
  }
};
