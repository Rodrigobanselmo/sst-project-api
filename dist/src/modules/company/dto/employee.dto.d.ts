import { SexTypeEnum, StatusEnum } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class CreateEmployeeDto {
    cpf: string;
    name: string;
    status: StatusEnum;
    companyId: string;
    workspaceIds: string[];
    hierarchyId: string;
    esocialCode: string;
    socialName: string;
    nickname: string;
    phone: string;
    email: string;
    isComorbidity: boolean;
    sex: SexTypeEnum;
    cidId: string;
    shiftId: number;
    birthday: Date;
}
declare const UpdateEmployeeDto_base: import("@nestjs/common").Type<Partial<CreateEmployeeDto>>;
export declare class UpdateEmployeeDto extends UpdateEmployeeDto_base {
    id?: number;
    companyId: string;
}
export declare class DeleteSubOfficeEmployeeDto {
    id: number;
    subOfficeId: string;
    companyId: string;
}
export declare class FindEmployeeDto extends PaginationQueryDto {
    search?: string;
    name?: string;
    cpf?: string;
    companyId?: string;
    hierarchyId?: string;
    hierarchySubOfficeId?: string;
    all?: boolean;
    expiredExam?: boolean;
    expiredDateExam: Date;
}
export {};
