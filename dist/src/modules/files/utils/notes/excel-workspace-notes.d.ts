import { PrismaService } from '../../../../prisma/prisma.service';
export declare const excelWorkspaceNotes: (prisma: PrismaService, companyId: string) => Promise<string[]>;
