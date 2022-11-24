import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class CreateCompanyClinicDto {
    companyId: string;
    clinicId: string;
}
declare const UpdateCompanyClinicDto_base: import("@nestjs/common").Type<Partial<CreateCompanyClinicDto>>;
export declare class UpdateCompanyClinicDto extends UpdateCompanyClinicDto_base {
}
export declare class SetCompanyClinicDto {
    ids?: CreateCompanyClinicDto[];
}
export declare class FindCompanyClinicDto extends PaginationQueryDto {
    search?: string;
    companyId?: string;
    clinicId?: string[];
}
export {};
