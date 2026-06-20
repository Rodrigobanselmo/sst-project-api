import { describe, expect, it } from '@jest/globals';

import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { HomogeneousGroupModel } from '@/@v2/documents/domain/models/homogeneous-group.model';
import { RiskDataModel } from '@/@v2/documents/domain/models/risk-data.model';
import { RiskModel } from '@/@v2/documents/domain/models/risk.model';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';
import { RiskDocumentsRequirementVO } from '@/@v2/shared/domain/values-object/document/risk-documents-requirement.vo';

import {
  applyDocumentRiskFilterToPgrModel,
  isRiskIncludedInDocumentFilter,
} from './apply-document-risk-filter.util';

const requirement = new RiskDocumentsRequirementVO({
  isAso: false,
  isPGR: true,
  isPCMSO: false,
  isPPP: false,
  companyId: null,
  hierarchyId: null,
});

const buildRisk = (params: {
  id: string;
  name: string;
  type: RiskTypeEnum;
  subTypeId?: number;
}) =>
  new RiskModel({
    id: params.id,
    name: params.name,
    type: params.type,
    severity: 2,
    isEmergency: false,
    isRepresentAll: false,
    unit: null,
    cas: null,
    propagation: null,
    appendix: null,
    nr15lt: null,
    twa: null,
    stel: null,
    acgihCeiling: null,
    ipvs: null,
    nioshRel: null,
    nioshStel: null,
    nioshCeiling: null,
    oshaPel: null,
    oshaStel: null,
    oshaCeiling: null,
    aihaWeel: null,
    aihaWeelCeiling: null,
    pe: null,
    pv: null,
    carnogenicityACGIH: null,
    carnogenicityLinach: null,
    symptoms: null,
    healthRisk: null,
    otherAppendix: null,
    grauInsalubridade: null,
    requirement: { document: requirement },
    documentsRequirements: [],
    subTypes: params.subTypeId
      ? [{ sub_type: { id: params.subTypeId, name: 'Subtipo' } }]
      : [],
  });

const buildRiskData = (risk: RiskModel) =>
  new RiskDataModel({
    id: `${risk.id}-data`,
    risk,
    companyId: 'company-1',
    homogeneousGroupId: 'gho-1',
    hierarchyId: null,
    level: 2,
    probability: 2,
    probabilityAfter: 2,
    levelAfter: 2,
    adms: [],
    engs: [],
    epis: [],
    dataRecs: [],
    generateSources: [],
    exams: [],
    data: {},
    activities: [],
    subOfficeEmployees: [],
    employees: [],
    hierarchy: null,
    homogeneousGroup: null,
    json: {},
  } as any);

const buildDocument = (risks: RiskModel[]) => {
  const risksData = risks.map(buildRiskData);

  return new DocumentPGRModel({
    documentVersion: {} as any,
    hierarchies: [],
    exams: [],
    scopeOfSelectedGroupIds: [],
    homogeneousGroups: [
      new HomogeneousGroupModel({
        id: 'gho-1',
        name: 'GSE',
        description: '',
        type: undefined as unknown as HomoTypeEnum,
        companyId: 'company-1',
        hierarchies: [],
        characterization: null,
        risksData,
      }),
    ],
  });
};

describe('apply-document-risk-filter', () => {
  it('keeps all risks when filter is empty', () => {
    const document = buildDocument([
      buildRisk({ id: 'r1', name: 'Ruído', type: RiskTypeEnum.FIS }),
      buildRisk({ id: 'r2', name: 'Stress', type: RiskTypeEnum.ERG }),
    ]);

    const filtered = applyDocumentRiskFilterToPgrModel(document, undefined);

    expect(filtered.risksData).toHaveLength(2);
  });

  it('excludes an entire category', () => {
    const noise = buildRisk({ id: 'r1', name: 'Ruído', type: RiskTypeEnum.FIS });
    const heat = buildRisk({ id: 'r2', name: 'Calor', type: RiskTypeEnum.FIS });
    const stress = buildRisk({ id: 'r3', name: 'Stress', type: RiskTypeEnum.ERG });

    const filtered = applyDocumentRiskFilterToPgrModel(
      buildDocument([noise, heat, stress]),
      {
        mode: 'EXCLUDE',
        excludedCategoryIds: [RiskTypeEnum.FIS],
      },
    );

    expect(filtered.risksData.map((item) => item.risk.id)).toEqual(['r3']);
  });

  it('excludes a specific risk factor', () => {
    const noise = buildRisk({ id: 'r1', name: 'Ruído', type: RiskTypeEnum.FIS });
    const heat = buildRisk({ id: 'r2', name: 'Calor', type: RiskTypeEnum.FIS });

    const filtered = applyDocumentRiskFilterToPgrModel(buildDocument([noise, heat]), {
      mode: 'EXCLUDE',
      excludedRiskFactorIds: ['r1'],
    });

    expect(filtered.risksData.map((item) => item.risk.id)).toEqual(['r2']);
  });

  it('excludes risks by subcategory', () => {
    const ergonomic = buildRisk({
      id: 'r1',
      name: 'Stress',
      type: RiskTypeEnum.ERG,
      subTypeId: 10,
    });
    const other = buildRisk({ id: 'r2', name: 'Postura', type: RiskTypeEnum.ERG });

    expect(
      isRiskIncludedInDocumentFilter(ergonomic, {
        mode: 'EXCLUDE',
        excludedSubcategoryIds: [10],
      }),
    ).toBe(false);

    const filtered = applyDocumentRiskFilterToPgrModel(
      buildDocument([ergonomic, other]),
      {
        mode: 'EXCLUDE',
        excludedSubcategoryIds: [10],
      },
    );

    expect(filtered.risksData.map((item) => item.risk.id)).toEqual(['r2']);
  });
});
