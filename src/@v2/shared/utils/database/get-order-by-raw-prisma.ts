import { Prisma } from '@prisma/client';
import { OrderByDirectionEnum } from '../../types/order-by.types';

export type IOrderByRawPrisma = {
  column: string;
  order: OrderByDirectionEnum;
};

export function getOrderByRawPrisma(orderBy: IOrderByRawPrisma[]): Prisma.Sql {
  if (orderBy.length == 0) return Prisma.sql``;

  const prismaOrderBy = orderBy.filter(({ order }) => order !== OrderByDirectionEnum.NONE).map(({ order, column }) => Prisma.sql`${Prisma.sql([column])} ${Prisma.sql([order])}`);
  if (prismaOrderBy.length == 0) return Prisma.sql``;

  const prismaOrderBySQL = Prisma.join(prismaOrderBy, ', ');
  return Prisma.sql`ORDER BY ${prismaOrderBySQL}`;
}
