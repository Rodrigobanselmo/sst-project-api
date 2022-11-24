import { RiskFactorDataEntity } from '../../../../../sst/entities/riskData.entity';
export declare const recommendationsConverter: (riskData: Partial<RiskFactorDataEntity>[]) => {
    data: string[];
    title: string;
}[];
