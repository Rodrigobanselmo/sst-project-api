import { Prisma } from '@prisma/client';

type IWhereRawPrismaOptions = {
  type: 'AND' | 'OR';
  removeWhereStatement?: boolean;
};

export function gerWhereRawPrisma(where: Prisma.Sql[], options?: IWhereRawPrismaOptions): Prisma.Sql {
  if (where.length === 0) return Prisma.sql``;

  const isOR = options?.type == 'OR';

  where = where.map((w) => {
    return Prisma.sql`(${w})`;
  });

  const raw = isOR ? Prisma.join(where, ' OR ') : Prisma.join(where, ' AND ');

  if (options?.removeWhereStatement) return raw;

  return Prisma.sql`WHERE ${raw}`;
}
