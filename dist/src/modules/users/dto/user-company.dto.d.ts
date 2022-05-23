import { StatusEnum } from '@prisma/client';
export declare class UserCompanyDto {
    readonly companyId: string;
    readonly roles: string[];
    readonly permissions: string[];
    status?: StatusEnum;
}
