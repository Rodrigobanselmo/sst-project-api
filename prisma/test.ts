import { PrismaClient } from '@prisma/client';
import { ActionPlanDAO } from '../src/@v2/security/database/dao/action-plan/action-plan.dao';

const prisma = new PrismaClient({});

const data = await new ActionPlanDAO(prisma).browse({
    filters: {
        companyId: 'd1309cad-19d4-4102-9bf9-231f91095c20',
    }
})

console.log(data[6])