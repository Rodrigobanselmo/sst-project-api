import { Prisma } from "@prisma/client";
import { OrderByDirectionEnum } from "../../types/order-by.types";

export type IOrderByRawPrisma = {
    column: string;
    direction: OrderByDirectionEnum
}


export function getOrderByRawPrisma(orderBy: IOrderByRawPrisma[]): Prisma.Sql {
    if (orderBy.length == 0) return Prisma.sql``

    const prismaOrderBy = orderBy.map(({ direction, column }) => (Prisma.sql`${Prisma.sql([column])} ${Prisma.sql([direction])}`))
    const prismaOrderBySQL = Prisma.join(prismaOrderBy, ', ')

    return Prisma.sql`ORDER BY ${prismaOrderBySQL}`
}