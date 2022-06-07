export declare class UpsertRiskDataDto {
    id?: string;
    probability?: number;
    probabilityAfter?: number;
    companyId: string;
    riskId: string;
    hierarchyId: string;
    homogeneousGroupId: string;
    riskFactorGroupDataId: string;
    recs?: string[];
    engs?: string[];
    adms?: string[];
    generateSources?: string[];
    epis?: number[];
}
export declare class UpsertManyRiskDataDto {
    id?: string;
    probability?: number;
    probabilityAfter?: number;
    companyId: string;
    riskId: string;
    hierarchyIds: string[];
    homogeneousGroupIds: string[];
    riskFactorGroupDataId: string;
    recs?: string[];
    engs?: string[];
    adms?: string[];
    generateSources?: string[];
    epis?: number[];
}
