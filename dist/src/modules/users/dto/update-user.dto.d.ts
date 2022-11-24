import { ProfessionalTypeEnum } from '@prisma/client';
import { CouncilDto } from './council.dto';
export declare class UpdateUserDto {
    oldPassword?: string;
    password?: string;
    name?: string;
    cpf?: string;
    googleExternalId?: string;
    phone?: string;
    certifications?: string[];
    formation?: string[];
    type?: ProfessionalTypeEnum;
    readonly token?: string;
    councils?: CouncilDto[];
    councilType?: string;
    councilUF?: string;
    councilId?: string;
}
