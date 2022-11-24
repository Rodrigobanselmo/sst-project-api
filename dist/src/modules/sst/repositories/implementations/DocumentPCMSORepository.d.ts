import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertDocumentPCMSODto } from '../../dto/document-pcmso.dto';
import { DocumentPCMSOEntity } from '../../entities/documentPCMSO.entity';
export declare class DocumentPCMSORepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ companyId, id, professionals, ...createDto }: UpsertDocumentPCMSODto): Promise<DocumentPCMSOEntity>;
    findAllByCompany(companyId: string): Promise<DocumentPCMSOEntity[]>;
    findById(companyId: string, options?: {
        select?: Prisma.DocumentPCMSOSelect;
        include?: Prisma.DocumentPCMSOInclude;
    }): Promise<DocumentPCMSOEntity>;
    findAllDataById(id: string, workspaceId: string, companyId: string, options?: {
        select?: Prisma.DocumentPCMSOSelect;
        include?: Prisma.DocumentPCMSOInclude;
    }): Promise<DocumentPCMSOEntity>;
    private setProfessionalsSignatures;
}
