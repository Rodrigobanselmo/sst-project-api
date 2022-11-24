import { RiskFactorsEntity } from './../../modules/sst/entities/risk.entity';
import { RiskFactorDataEntity } from './../../modules/sst/entities/riskData.entity';
export declare type IPriorRiskData = {
    riskData: RiskFactorDataEntity[];
    riskFactor: RiskFactorsEntity;
};
export declare function onGetRisks(riskData: RiskFactorDataEntity[]): {
    riskFactor: RiskFactorsEntity;
    riskData: RiskFactorDataEntity[];
}[];
