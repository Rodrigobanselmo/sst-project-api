import { ProfessionalTypeEnum, StatusEnum } from '@prisma/client';
import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { CouncilDto } from './council.dto';
export declare class CreateProfessionalDto {
    name: string;
    cpf?: string;
    phone?: string;
    email?: string;
    certifications?: string[];
    formation?: string[];
    type: ProfessionalTypeEnum;
    status?: StatusEnum;
    inviteId?: string;
    userId?: number;
    sendEmail?: boolean;
    councils?: CouncilDto[];
}
declare const UpdateProfessionalDto_base: import("@nestjs/common").Type<Partial<CreateProfessionalDto>>;
export declare class UpdateProfessionalDto extends UpdateProfessionalDto_base {
    readonly id: number;
    councils?: CouncilDto[];
}
export declare class FindProfessionalsDto extends PaginationQueryDto {
    search?: string;
    name?: string;
    cpf?: string;
    email?: string;
    councilType?: string;
    councilUF?: string;
    councilId?: string;
    companyId?: string;
    companies?: string[];
    id?: number[];
    userCompanyId?: string;
    byCouncil?: boolean;
    type: ProfessionalTypeEnum[];
}
export {};
