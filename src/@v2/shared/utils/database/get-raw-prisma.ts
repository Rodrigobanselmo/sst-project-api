import { Prisma } from '@prisma/client';

export function gerRawPrisma(data: string, condition: boolean): Prisma.Sql {
  if (!condition) {
    return Prisma.sql``;
  }

  return Prisma.sql([data]);
}
