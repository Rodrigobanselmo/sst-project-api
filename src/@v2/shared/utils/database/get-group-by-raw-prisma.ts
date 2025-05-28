import { Prisma } from '@prisma/client';

export function gerGroupByRawPrisma(by: string[]): Prisma.Sql {
  if (by.length === 0) return Prisma.sql``;

  const btSql = by.map((field) => {
    return Prisma.sql`${field}`;
  });

  const raw = Prisma.join(btSql, ',');

  return Prisma.sql`ORDER BY ${raw}`;
}
