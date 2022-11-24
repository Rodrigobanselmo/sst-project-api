import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { CreateDocumentDto, FindDocumentDto, UpdateDocumentDto } from '../../dto/document.dto';
import { DocumentEntity } from '../../entities/document.entity';
export declare class DocumentRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ ...createCompanyDto }: CreateDocumentDto): Promise<DocumentEntity>;
    update({ id, companyId, ...createCompanyDto }: UpdateDocumentDto): Promise<DocumentEntity>;
    find(query: Partial<FindDocumentDto>, pagination: PaginationQueryDto, options?: Prisma.DocumentFindManyArgs): Promise<{
        data: DocumentEntity[];
        count: number;
    }>;
    findNude(options?: Prisma.DocumentFindManyArgs): Promise<DocumentEntity[]>;
    findFirstNude(options?: Prisma.DocumentFindFirstArgs): Promise<DocumentEntity>;
    delete(id: number, companyId: string): Promise<DocumentEntity>;
}
