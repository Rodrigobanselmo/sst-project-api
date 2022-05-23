import { StatusEnum } from '@prisma/client';
export declare class CreateHomoGroupDto {
    name: string;
    description: string;
    status?: StatusEnum;
    companyId: string;
    readonly hierarchies?: string[];
}
export declare class UpdateHomoGroupDto {
    id?: string;
    description?: string;
    name: string;
    readonly hierarchies?: string[];
}
