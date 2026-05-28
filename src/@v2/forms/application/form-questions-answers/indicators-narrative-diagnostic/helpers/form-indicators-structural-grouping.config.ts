import { FormParticipantStructureBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-participant-structure-browse.model';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

const FORM_PARTICIPANT_NO_ESTABLISHMENT_LABEL = 'Sem estabelecimento';
const FORM_PARTICIPANT_MISSING_DIRECTORY_LABEL = 'Sem superintendência';
const FORM_PARTICIPANT_MISSING_MANAGEMENT_LABEL = 'Sem diretoria';
const FORM_PARTICIPANT_MISSING_SUB_SECTOR_LABEL = 'Sem subsetor';
export const FORM_PARTICIPANT_MISSING_SECTOR_LABEL = 'Sem setor';

export const STRUCTURAL_INDICATOR_GROUPING_KEYS = [
  '__participant_workspace',
  '__participant_directory',
  '__participant_management',
  '__participant_sector',
  '__participant_sub_sector',
] as const;

export type StructuralIndicatorGroupingKey =
  (typeof STRUCTURAL_INDICATOR_GROUPING_KEYS)[number];

export type StructuralIndicatorGroupingConfig = {
  key: StructuralIndicatorGroupingKey;
  selectLabel: string;
  missingLabel: string;
  resolveGroup: (structure: FormParticipantStructureBrowseModel) => {
    groupId: string;
    groupName: string;
  };
};

const STRUCTURAL_KEY_PREFIX = '__structural__';

export function isStructuralIndicatorGroupingKey(
  value: string | null | undefined,
): value is StructuralIndicatorGroupingKey {
  return (
    value != null &&
    (STRUCTURAL_INDICATOR_GROUPING_KEYS as readonly string[]).includes(value)
  );
}

export function getStructuralIndicatorGroupingConfig(
  key: StructuralIndicatorGroupingKey,
): StructuralIndicatorGroupingConfig | undefined {
  return STRUCTURAL_INDICATOR_GROUPING_CONFIGS.find((c) => c.key === key);
}

export function getStructuralIndicatorGroupingLabel(
  key: StructuralIndicatorGroupingKey,
): string {
  return getStructuralIndicatorGroupingConfig(key)?.selectLabel ?? key;
}

function hierarchyNodeId(
  key: StructuralIndicatorGroupingKey,
  type: HierarchyTypeEnum,
  nodeId: string | null,
): string {
  return `${STRUCTURAL_KEY_PREFIX}${key}::${type}::${nodeId ?? '__none__'}`;
}

function findHierarchyName(
  structure: FormParticipantStructureBrowseModel,
  type: HierarchyTypeEnum,
  missingLabel: string,
): { nodeId: string | null; groupName: string } {
  const node = structure.hierarchies.find((h) => h.type === type);
  const name = node?.name?.trim();
  if (name) {
    return { nodeId: node!.id, groupName: name };
  }
  return { nodeId: null, groupName: missingLabel };
}

export const STRUCTURAL_INDICATOR_GROUPING_CONFIGS: StructuralIndicatorGroupingConfig[] =
  [
    {
      key: '__participant_workspace',
      selectLabel: 'Estabelecimento',
      missingLabel: FORM_PARTICIPANT_NO_ESTABLISHMENT_LABEL,
      resolveGroup: (structure) => {
        const name = structure.workspaceName?.trim();
        if (name) {
          return {
            groupId: `${STRUCTURAL_KEY_PREFIX}__participant_workspace::${structure.workspaceId ?? '__none__'}`,
            groupName: name,
          };
        }
        return {
          groupId: `${STRUCTURAL_KEY_PREFIX}__participant_workspace::__none__`,
          groupName: FORM_PARTICIPANT_NO_ESTABLISHMENT_LABEL,
        };
      },
    },
    {
      key: '__participant_directory',
      selectLabel: 'Superintendência',
      missingLabel: FORM_PARTICIPANT_MISSING_DIRECTORY_LABEL,
      resolveGroup: (structure) => {
        const { nodeId, groupName } = findHierarchyName(
          structure,
          HierarchyTypeEnum.DIRECTORY,
          FORM_PARTICIPANT_MISSING_DIRECTORY_LABEL,
        );
        return {
          groupId: hierarchyNodeId(
            '__participant_directory',
            HierarchyTypeEnum.DIRECTORY,
            nodeId,
          ),
          groupName,
        };
      },
    },
    {
      key: '__participant_management',
      selectLabel: 'Diretoria',
      missingLabel: FORM_PARTICIPANT_MISSING_MANAGEMENT_LABEL,
      resolveGroup: (structure) => {
        const { nodeId, groupName } = findHierarchyName(
          structure,
          HierarchyTypeEnum.MANAGEMENT,
          FORM_PARTICIPANT_MISSING_MANAGEMENT_LABEL,
        );
        return {
          groupId: hierarchyNodeId(
            '__participant_management',
            HierarchyTypeEnum.MANAGEMENT,
            nodeId,
          ),
          groupName,
        };
      },
    },
    {
      key: '__participant_sector',
      selectLabel: 'Setor',
      missingLabel: FORM_PARTICIPANT_MISSING_SECTOR_LABEL,
      resolveGroup: (structure) => {
        const { nodeId, groupName } = findHierarchyName(
          structure,
          HierarchyTypeEnum.SECTOR,
          FORM_PARTICIPANT_MISSING_SECTOR_LABEL,
        );
        return {
          groupId: hierarchyNodeId(
            '__participant_sector',
            HierarchyTypeEnum.SECTOR,
            nodeId,
          ),
          groupName,
        };
      },
    },
    {
      key: '__participant_sub_sector',
      selectLabel: 'Subsetor',
      missingLabel: FORM_PARTICIPANT_MISSING_SUB_SECTOR_LABEL,
      resolveGroup: (structure) => {
        const { nodeId, groupName } = findHierarchyName(
          structure,
          HierarchyTypeEnum.SUB_SECTOR,
          FORM_PARTICIPANT_MISSING_SUB_SECTOR_LABEL,
        );
        return {
          groupId: hierarchyNodeId(
            '__participant_sub_sector',
            HierarchyTypeEnum.SUB_SECTOR,
            nodeId,
          ),
          groupName,
        };
      },
    },
  ];
