import { FormParticipantStructureBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-participant-structure-browse.model';
import {
  getStructuralIndicatorGroupingConfig,
  type StructuralIndicatorGroupingKey,
} from './form-indicators-structural-grouping.config';
import type { ParticipantGroupForIndicators } from './build-participant-groups-for-indicators';

export function buildStructuralParticipantGroupsForIndicators(params: {
  participantStructures: FormParticipantStructureBrowseModel[];
  groupingKey: StructuralIndicatorGroupingKey;
}): ParticipantGroupForIndicators[] {
  const { participantStructures, groupingKey } = params;
  const config = getStructuralIndicatorGroupingConfig(groupingKey);
  if (!config) return [];

  const groupsMap = new Map<string, ParticipantGroupForIndicators>();

  for (const structure of participantStructures) {
    const { groupId, groupName } = config.resolveGroup(structure);
    let group = groupsMap.get(groupId);
    if (!group) {
      group = {
        id: groupId,
        name: groupName,
        participantIds: new Set<string>(),
      };
      groupsMap.set(groupId, group);
    }
    group.participantIds.add(structure.participantsAnswersId);
  }

  return Array.from(groupsMap.values())
    .filter((g) => g.participantIds.size > 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}
