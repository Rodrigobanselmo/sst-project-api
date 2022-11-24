import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { DocumentTypeEnum, StatusEnum } from '@prisma/client';
export declare class CreateDocumentDto {
    fileUrl: string;
    name?: string;
    type: DocumentTypeEnum;
    status: StatusEnum;
    startDate?: Date;
    endDate?: Date;
    description?: string;
    companyId: string;
    workspaceId?: string;
    parentDocumentId?: number;
}
declare const UpdateDocumentDto_base: import("@nestjs/common").Type<Partial<CreateDocumentDto>>;
export declare class UpdateDocumentDto extends UpdateDocumentDto_base {
    id?: number;
    parentDocumentId?: number;
}
export declare class FindDocumentDto extends PaginationQueryDto {
    search?: string;
    companyId?: string;
    workspaceId?: string;
    type?: DocumentTypeEnum[];
    status: StatusEnum;
}
export {};
