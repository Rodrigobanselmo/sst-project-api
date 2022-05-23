import { PrismaService } from '../../../../prisma/prisma.service';
export declare const excelWorkplaceNotes: (prisma: PrismaService, companyId: string) => Promise<string[]>;
