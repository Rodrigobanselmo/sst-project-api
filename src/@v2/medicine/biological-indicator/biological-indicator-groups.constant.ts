import {
  BiologicalIndicatorSubstanceGroupTypeEnum,
} from '@prisma/client';

export type NormativeSubstanceGroupDefinition = {
  groupType: BiologicalIndicatorSubstanceGroupTypeEnum;
  name: string;
  substanceNames: string[];
};

export const NORMATIVE_SUBSTANCE_GROUPS: NormativeSubstanceGroupDefinition[] = [
  {
    groupType: BiologicalIndicatorSubstanceGroupTypeEnum.METHEMOGLOBIN_INDUCTORS,
    name: 'Indutores de metahemoglobina',
    substanceNames: ['Indutores de metahemoglobina'],
  },
  {
    groupType: BiologicalIndicatorSubstanceGroupTypeEnum.CHOLINESTERASE_INHIBITORS,
    name: 'Inseticidas inibidores da Colinesterase',
    substanceNames: ['Inseticidas inibidores da Colinesterase'],
  },
  {
    groupType: BiologicalIndicatorSubstanceGroupTypeEnum.INORGANIC_FLUORIDES,
    name: 'Flúor, ácido fluorídrico e fluoretos inorgânicos',
    substanceNames: ['Flúor, ácido fluorídrico e fluoretos inorgânicos'],
  },
];

export function resolveNormativeSubstanceGroup(
  substanceName: string,
): NormativeSubstanceGroupDefinition | null {
  const normalized = substanceName.trim().toLowerCase();

  return (
    NORMATIVE_SUBSTANCE_GROUPS.find((group) =>
      group.substanceNames.some(
        (candidate) => candidate.trim().toLowerCase() === normalized,
      ),
    ) ?? null
  );
}

export function isNormativeSubstanceGroup(substanceName: string): boolean {
  return resolveNormativeSubstanceGroup(substanceName) !== null;
}
