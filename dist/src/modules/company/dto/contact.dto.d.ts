import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { StatusEnum } from '@prisma/client';
export declare class CreateContactDto {
    name: string;
    companyId: string;
    phone: string;
    isPrincipal: boolean;
    phone_1: string;
    email: string;
    obs: string;
}
declare const UpdateContactDto_base: import("@nestjs/common").Type<Partial<CreateContactDto>>;
export declare class UpdateContactDto extends UpdateContactDto_base {
    id: number;
    isPrincipal: boolean;
    status: StatusEnum;
}
export declare class FindContactDto extends PaginationQueryDto {
    search?: string;
    companyId?: string;
    companiesIds?: string[];
}
export {};
