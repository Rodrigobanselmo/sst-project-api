import { RecMed } from '.prisma/client';
import { MeasuresTypeEnum, StatusEnum } from '@prisma/client';
export declare class RecMedEntity implements RecMed {
    id: string;
    riskId: string;
    recName: string;
    medName: string;
    companyId: string;
    system: boolean;
    medType: MeasuresTypeEnum;
    status: StatusEnum;
    created_at: Date;
    generateSourceId: string;
    deleted_at: Date | null;
    constructor(partial: Partial<RecMedEntity>);
}
