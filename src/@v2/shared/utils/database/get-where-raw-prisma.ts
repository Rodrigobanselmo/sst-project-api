import { Prisma } from "@prisma/client"

type IWhereRawPrismaOptions = {
    type: 'AND' | 'OR',
}

export function gerWhereRawPrisma(where: Prisma.Sql[], options?: IWhereRawPrismaOptions): Prisma.Sql {
    if (where.length === 0) return Prisma.sql``

    const isOR = options?.type == 'OR'

    const raw = isOR
        ? Prisma.join(where, ' OR ')
        : Prisma.join(where, ' AND ')

    return Prisma.sql`WHERE ${raw}`
}