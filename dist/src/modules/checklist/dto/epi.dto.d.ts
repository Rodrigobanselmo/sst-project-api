import { StatusEnum } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class CreateEpiDto {
    ca: string;
    equipment: string;
    national?: boolean;
    description?: string;
    report?: string;
    restriction?: string;
    observation?: string;
    expiredDate?: Date;
    isValid?: boolean;
    status?: StatusEnum;
}
export declare class UpsertEpiDto extends CreateEpiDto {
    id: string;
}
declare const UpdateEpiDto_base: import("@nestjs/common").Type<Partial<CreateEpiDto>>;
export declare class UpdateEpiDto extends UpdateEpiDto_base {
}
export declare class FindEpiDto extends PaginationQueryDto {
    ca?: string;
    equipment?: string;
}
export {};
