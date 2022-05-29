import { EpiEntity } from './epi.entity';
import { GenerateSourceEntity } from './generateSource.entity';
import { RecMedEntity } from './recMed.entity';
import { RiskFactorData } from '.prisma/client';
import { HierarchyEntity } from '../../company/entities/hierarchy.entity';
import { HomoGroupEntity } from '../../company/entities/homoGroup.entity';
import { RiskFactorsEntity } from './risk.entity';
export declare class RiskFactorDataEntity implements RiskFactorData {
    id: string;
    probability: number;
    probabilityAfter: number;
    companyId: string;
    created_at: Date;
    hierarchy?: HierarchyEntity;
    hierarchyId: string;
    homogeneousGroup?: HomoGroupEntity;
    homogeneousGroupId: string;
    riskFactor?: RiskFactorsEntity;
    riskId: string;
    riskFactorGroupDataId: string;
    recs?: RecMedEntity[];
    engs?: RecMedEntity[];
    adms?: RecMedEntity[];
    generateSources?: GenerateSourceEntity[];
    epis?: EpiEntity[];
    constructor(partial: Partial<RiskFactorDataEntity>);
}
