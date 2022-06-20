import { StatusEnum } from '@prisma/client';
export declare class CreateDatabaseTableDto {
    name: string;
    version?: number;
    companyId: string;
    status?: StatusEnum;
}
