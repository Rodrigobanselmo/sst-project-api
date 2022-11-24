import { PrismaClient } from '@prisma/client';
export declare const seedEmployees: (prisma: PrismaClient, companyId: string, workId: string) => Promise<void>;
