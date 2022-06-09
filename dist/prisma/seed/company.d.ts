import { PrismaClient } from '@prisma/client';
export declare const seedCompany: (prisma: PrismaClient, options?: {
    skip?: true;
}) => Promise<{
    workId: string;
    companyId: string;
    company: {};
} | {
    workId: string;
    companyId: string;
    company: import(".prisma/client").Company & {
        workspace: import(".prisma/client").Workspace[];
    };
}>;
