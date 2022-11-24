import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
export declare class CreateCompanyShiftDto {
    name: string;
    description: string;
    companyId: string;
}
declare const UpdateCompanyShiftDto_base: import("@nestjs/common").Type<Partial<CreateCompanyShiftDto>>;
export declare class UpdateCompanyShiftDto extends UpdateCompanyShiftDto_base {
    id: number;
}
export declare class FindCompanyShiftDto extends PaginationQueryDto {
    companyId: string;
    search?: string;
    name?: string;
}
export {};
