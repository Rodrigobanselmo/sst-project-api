import { StatusEnum, HierarchyEnum } from '@prisma/client';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { FormParticipantsBrowseResultModel } from '@/@v2/forms/domain/models/form-participants/form-participants-browse-result.model';
import { IFormQuestionsAnswersRisksService } from '../services/form-questions-answers-risks.types';

export type EligibleHierarchyEntity = IFormQuestionsAnswersRisksService.EligibleHierarchyEntity;

function resolveParticipantHierarchyIdForType(
  hierarchies: FormParticipantsBrowseResultModel['hierarchies'],
  hierarchyType: HierarchyEnum,
): string | undefined {
  const match = hierarchies.find(
    (h) => h.type === (hierarchyType as unknown as HierarchyTypeEnum),
  );
  return match?.id;
}

export function collectHierarchyIdsUsedInCampaignScope(params: {
  hierarchyType: HierarchyEnum;
  scopedParticipants: FormParticipantsBrowseResultModel[];
  participantAnswers: IFormQuestionsAnswersRisksService.ParticipantAnswerData[];
}): Set<string> {
  const usedIds = new Set<string>();

  for (const participantAnswer of params.participantAnswers) {
    usedIds.add(participantAnswer.hierarchy.id);
  }

  for (const participant of params.scopedParticipants) {
    const hierarchyId = resolveParticipantHierarchyIdForType(
      participant.hierarchies,
      params.hierarchyType,
    );
    if (hierarchyId) {
      usedIds.add(hierarchyId);
    }
  }

  return usedIds;
}

export function buildParticipantCountByHierarchyId(params: {
  hierarchyType: HierarchyEnum;
  scopedParticipants: FormParticipantsBrowseResultModel[];
}): Map<string, number> {
  const counts = new Map<string, number>();

  for (const participant of params.scopedParticipants) {
    const hierarchyId = resolveParticipantHierarchyIdForType(
      participant.hierarchies,
      params.hierarchyType,
    );
    if (!hierarchyId) continue;

    counts.set(hierarchyId, (counts.get(hierarchyId) ?? 0) + 1);
  }

  return counts;
}

export function buildEligibleHierarchyEntityMap(params: {
  usedHierarchyIds: Set<string>;
  hierarchyMap: Record<string, IFormQuestionsAnswersRisksService.HierarchyData>;
  entityEstablishmentMap: Record<string, string>;
  companyNameById: Record<string, string>;
  participantCountByHierarchyId?: Map<string, number>;
}): Record<string, EligibleHierarchyEntity> {
  const eligibleEntityMap: Record<string, EligibleHierarchyEntity> = {};

  for (const hierarchyId of params.usedHierarchyIds) {
    const hierarchy = params.hierarchyMap[hierarchyId];
    if (!hierarchy || hierarchy.status !== StatusEnum.ACTIVE) continue;

    const establishment = params.entityEstablishmentMap[hierarchyId]?.trim();
    const companyName = params.companyNameById[hierarchy.companyId]?.trim();

    eligibleEntityMap[hierarchyId] = {
      id: hierarchy.id,
      name: hierarchy.name,
      type: hierarchy.type,
      companyId: hierarchy.companyId,
      participantCount: params.participantCountByHierarchyId?.get(hierarchyId) ?? 0,
      ...(establishment ? { establishment } : {}),
      ...(companyName ? { companyName } : {}),
    };
  }

  return eligibleEntityMap;
}
