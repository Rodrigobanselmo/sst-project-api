import { OrderByDirectionEnum } from '../src/@v2/shared/types/order-by.types';
import { PrismaClient } from '@prisma/client';
import { ActionPlanDAO } from '../src/@v2/security/database/dao/action-plan/action-plan.dao';
import { ActionPlanOrderByEnum } from '../src/@v2/security/database/dao/action-plan/action-plan.types';

const prisma = new PrismaClient({});

console.time('prisma')
const data = await new ActionPlanDAO(prisma).browse({
    filters: {
        companyId: 'd1309cad-19d4-4102-9bf9-231f91095c20',
        search: 'ACao',
    },
    orderBy: [{
        field: ActionPlanOrderByEnum.VALID_DATE,
        order: OrderByDirectionEnum.DESC
    }]
})

console.log(data[0])
console.log(data.length)
console.timeEnd('prisma')