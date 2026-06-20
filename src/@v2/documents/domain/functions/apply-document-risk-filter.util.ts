import {
  DocumentGenerationRiskFilterSnapshot,
  hasActiveDocumentRiskFilter,
} from '@/@v2/documents/domain/types/document-generation-risk-filter.type';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { HomogeneousGroupModel } from '@/@v2/documents/domain/models/homogeneous-group.model';
import { RiskDataModel } from '@/@v2/documents/domain/models/risk-data.model';
import { RiskModel } from '@/@v2/documents/domain/models/risk.model';

export const isRiskIncludedInDocumentFilter = (
  risk: RiskModel,
  filter?: DocumentGenerationRiskFilterSnapshot | null,
): boolean => {
  if (!hasActiveDocumentRiskFilter(filter)) return true;

  if (filter.excludedCategoryIds?.includes(risk.type)) return false;

  if (filter.excludedSubcategoryIds?.length) {
    const subcategoryIds = risk.subTypes?.map((item) => item.sub_type.id) ?? [];

    if (
      subcategoryIds.some((subcategoryId) =>
        filter.excludedSubcategoryIds!.includes(subcategoryId),
      )
    ) {
      return false;
    }
  }

  if (filter.excludedRiskFactorIds?.includes(risk.id)) return false;

  return true;
};

export const isRiskDataIncludedInDocumentFilter = (
  riskData: RiskDataModel,
  filter?: DocumentGenerationRiskFilterSnapshot | null,
): boolean => isRiskIncludedInDocumentFilter(riskData.risk, filter);

export const applyDocumentRiskFilterToPgrModel = (
  document: DocumentPGRModel,
  filter?: DocumentGenerationRiskFilterSnapshot | null,
): DocumentPGRModel => {
  if (!hasActiveDocumentRiskFilter(filter)) return document;

  const homogeneousGroups = document.homogeneousGroups.map((group) => {
    const filteredRiskData = group.allRiskData.filter((riskData) =>
      isRiskDataIncludedInDocumentFilter(riskData, filter),
    );

    return new HomogeneousGroupModel({
      id: group.id,
      name: group.name,
      description: group.description,
      type: group.type,
      companyId: group.companyId,
      hierarchies: group.hierarchies,
      characterization: group.characterization,
      risksData: filteredRiskData,
      frpsOnly: group.frpsOnly,
    });
  });

  return new DocumentPGRModel({
    documentVersion: document.documentVersion,
    hierarchies: document.hierarchies,
    homogeneousGroups,
    exams: document.exams,
    scopeOfSelectedGroupIds: document.scopeOfSelectedGroupIds,
  });
};

export const countDocumentPgrRiskData = (document: DocumentPGRModel): number =>
  document.risksData.length;
