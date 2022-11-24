import { UserCompanyDto } from './user-company.dto';
declare const UpdateUserCompanyDto_base: import("@nestjs/common").Type<Partial<UserCompanyDto>>;
export declare class UpdateUserCompanyDto extends UpdateUserCompanyDto_base {
    readonly companyId: string;
    readonly userId: number;
    companiesIds?: string[];
}
export {};
