import { Prisma } from "@prisma/client"

type IHavingRawPrismaOptions = {
  type: 'AND' | 'OR',
}

export function gerHavingRawPrisma(having: Prisma.Sql[], options?: IHavingRawPrismaOptions): Prisma.Sql {
  if (having.length === 0) return Prisma.sql``

  const isOR = options?.type == 'OR'

  const raw = isOR
    ? Prisma.join(having, ' OR ')
    : Prisma.join(having, ' AND ')

  return Prisma.sql`HAVING ${raw}`
}