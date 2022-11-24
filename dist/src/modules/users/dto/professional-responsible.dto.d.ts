import { ProfessionalRespTypeEnum } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class CreateProfessionalResponsibleDto {
    startDate: Date;
    companyId: string;
    professionalCouncilId: number;
    type?: ProfessionalRespTypeEnum;
}
declare const UpdateProfessionalResponsibleDto_base: import("@nestjs/common").Type<Partial<CreateProfessionalResponsibleDto>>;
export declare class UpdateProfessionalResponsibleDto extends UpdateProfessionalResponsibleDto_base {
    id?: number;
    startDate: Date;
    companyId: string;
    professionalCouncilId: number;
}
export declare class FindProfessionalResponsibleDto extends PaginationQueryDto {
    search?: string;
    companyId?: string;
}
export {};
