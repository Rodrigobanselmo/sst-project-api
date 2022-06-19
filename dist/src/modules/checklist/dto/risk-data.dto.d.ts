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
    keepEmpty?: boolean;
}
export declare class UpsertManyRiskDataDto {
    id?: string;
    probability?: number;
    probabilityAfter?: number;
    companyId: string;
    riskId: string;
    riskIds: string[];
    hierarchyIds: string[];
    homogeneousGroupIds: string[];
    riskFactorGroupDataId: string;
    recs?: string[];
    engs?: string[];
    adms?: string[];
    generateSources?: string[];
    epis?: number[];
}
export declare class DeleteManyRiskDataDto {
    riskIds: string[];
    homogeneousGroupIds: string[];
}
