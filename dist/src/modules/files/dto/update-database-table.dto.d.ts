import { StatusEnum } from '@prisma/client';
export declare class UpdateFileDto {
    name: string;
    companyId: string;
    version: number;
    status?: StatusEnum;
}
