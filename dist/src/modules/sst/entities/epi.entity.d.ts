import { Epi } from '.prisma/client';
import { StatusEnum } from '@prisma/client';
import { EpiRiskDataEntity } from './epiRiskData.entity';
export declare class EpiEntity implements Epi {
    id: number;
    ca: string;
    equipment: string;
    description: string;
    isValid: boolean;
    status: StatusEnum;
    expiredDate: Date;
    created_at: Date;
    national: boolean;
    report: string;
    restriction: string;
    observation: string;
    deleted_at: Date | null;
    epiRiskData: EpiRiskDataEntity;
    constructor(partial: Partial<EpiEntity>);
}
