import { CoverTypeEnum, DocumentCover, Prisma } from '@prisma/client';
export declare class DocumentCoverEntity implements DocumentCover {
    id: number;
    name: string;
    json: Prisma.JsonValue;
    description: string;
    companyId: string;
    acceptType: CoverTypeEnum[];
    constructor(partial: Partial<DocumentCoverEntity>);
}
