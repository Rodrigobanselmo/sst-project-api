import { Prisma } from "@prisma/client";
import { OrderByDirectionEnum } from "../../types/order-by.types";

export type IOrderByRawPrisma = {
    column: string;
    order: OrderByDirectionEnum
}


export function getOrderByRawPrisma(orderBy: IOrderByRawPrisma[]): Prisma.Sql {
    if (orderBy.length == 0) return Prisma.sql``

    const prismaOrderBy = orderBy.map(({ order, column }) => (Prisma.sql`${Prisma.sql([column])} ${Prisma.sql([order])}`))
    const prismaOrderBySQL = Prisma.join(prismaOrderBy, ', ')

    return Prisma.sql`ORDER BY ${prismaOrderBySQL}`
}