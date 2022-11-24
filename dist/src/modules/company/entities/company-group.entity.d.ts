import { ProfessionalEntity } from './../../users/entities/professional.entity';
import { CompanyGroup } from '.prisma/client';
import { ProfessionalCouncil } from '@prisma/client';
import { CompanyEntity } from './company.entity';
import { CompanyCertEntity } from '../../../modules/esocial/entities/companyCert.entity';
export declare class CompanyGroupEntity implements CompanyGroup {
    id: number;
    name: string;
    description: string;
    esocialSend: boolean;
    created_at: Date;
    updated_at: Date;
    companyId: string;
    numAsos: number;
    blockResignationExam: boolean;
    esocialStart: Date;
    doctorResponsibleId: number;
    tecResponsibleId: number;
    doctorResponsible?: Partial<ProfessionalEntity & ProfessionalCouncil>;
    tecResponsible?: Partial<ProfessionalEntity & ProfessionalCouncil>;
    ambResponsible?: Partial<ProfessionalEntity & ProfessionalCouncil>;
    company?: Partial<CompanyEntity>;
    cert?: CompanyCertEntity;
    companyGroup?: Partial<CompanyEntity>;
    constructor(partial: Partial<CompanyGroupEntity>);
}
