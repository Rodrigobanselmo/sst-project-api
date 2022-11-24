import { StatusEnum } from '@prisma/client';
export declare class UserCompanyEditDto {
    readonly userId: number;
    readonly roles?: string[];
    readonly permissions?: string[];
    status?: StatusEnum;
}
