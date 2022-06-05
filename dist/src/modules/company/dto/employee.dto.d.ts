import { StatusEnum } from '@prisma/client';
export declare class CreateEmployeeDto {
    cpf: string;
    name: string;
    status: StatusEnum;
    companyId: string;
    workspaceIds: string[];
    hierarchyId: string;
}
declare const UpdateEmployeeDto_base: import("@nestjs/common").Type<Partial<CreateEmployeeDto>>;
export declare class UpdateEmployeeDto extends UpdateEmployeeDto_base {
    id?: number;
    companyId: string;
}
export {};
