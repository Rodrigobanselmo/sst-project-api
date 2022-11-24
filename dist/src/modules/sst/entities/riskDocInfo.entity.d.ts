import { RiskFactorsDocInfo } from '@prisma/client';
export declare class RiskDocInfoEntity implements RiskFactorsDocInfo {
    id: number;
    riskId: string;
    companyId: string;
    hierarchyId: string;
    isAso: boolean;
    isPGR: boolean;
    isPCMSO: boolean;
    isPPP: boolean;
    created_at: Date;
    constructor(partial: Partial<RiskDocInfoEntity>);
}
