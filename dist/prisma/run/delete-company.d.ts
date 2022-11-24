import { PrismaClient } from '@prisma/client';
export declare const deleteWithNameCompany: (name: string, prisma: PrismaClient) => Promise<void>;
export declare const deleteCompany: (id: string, prisma: PrismaClient) => Promise<void>;
