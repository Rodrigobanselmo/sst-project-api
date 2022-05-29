import { Epi } from '.prisma/client';
import { StatusEnum } from '@prisma/client';
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
    constructor(partial: Partial<EpiEntity>);
}
