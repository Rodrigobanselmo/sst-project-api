import { RiskDocInfoEntity } from './../../modules/sst/entities/riskDocInfo.entity';
import { RiskFactorDataEntity } from '../../modules/sst/entities/riskData.entity';
import { RiskFactorsEntity } from '../../modules/sst/entities/risk.entity';

type IOptions = { companyId?: string; hierarchyId?: string; getIfAnyIsTrue?: boolean; docType?: keyof RiskDocInfoEntity };

export const getRiskDoc = (risk: RiskFactorsEntity, { companyId, hierarchyId, getIfAnyIsTrue, docType }: IOptions) => {
  if (getIfAnyIsTrue && docType) {
    const data = risk?.docInfo?.find((i) => i.hierarchyId && i[docType]);
    if (data) return data;
  }

  if (hierarchyId) {
    const data = risk?.docInfo?.find((i) => i.hierarchyId && i.hierarchyId == hierarchyId);
    if (data) return data;
  }

  if (companyId) {
    const first = risk?.docInfo?.find((i) => !i.hierarchyId && i.companyId === companyId);
    if (first) return first;
  }

  const second = risk?.docInfo?.find((i) => !i.hierarchyId);
  if (second) return second;

  return risk;
};

export const getRiskDocV2 = (risk: RiskFactorsEntity, { companyId, hierarchyId, getIfAnyIsTrue, docType }: IOptions) => {
  let data: RiskDocInfoEntity, first: RiskDocInfoEntity, second: RiskDocInfoEntity;

  risk?.docInfo?.some((i) => {
    const isFromDocTypeAndInAnyHierarchy = getIfAnyIsTrue && docType && i.hierarchyId && i[docType];
    if (isFromDocTypeAndInAnyHierarchy) {
      data = i;
      return true;
    }

    const isFromHierarchyId = hierarchyId && i.hierarchyId && i.hierarchyId == hierarchyId;
    if (isFromHierarchyId) {
      data = i;
      return true;
    }

    const isFromCompanyAndMissingHierarchy = companyId && !i.hierarchyId && i.companyId === companyId;
    const isSystemStandard = !i.hierarchyId
    
    if (isFromCompanyAndMissingHierarchy) {
      first = i;
    } else if (isSystemStandard) {
      second = i;
    }

    return false;
  });

  return data || first || second || risk;
};

export const checkRiskDataDoc = (riskData: RiskFactorDataEntity[], { companyId, docType }: { companyId: string; docType: keyof RiskDocInfoEntity }) => {
  return riskData.filter((riskData) => {
    const foundHierarchyDoc = riskData.riskFactor.docInfo.find((doc) => doc.hierarchyId == riskData.homogeneousGroupId);

    if (foundHierarchyDoc) return foundHierarchyDoc[docType];

    const isChecked = riskData.riskFactor.docInfo.find((riskData) => riskData.hierarchyId && riskData[docType]);

    const docInfo = getRiskDoc(riskData.riskFactor, { companyId });
    if (docInfo[docType] || isChecked) return true;

    return false;
  });
};
