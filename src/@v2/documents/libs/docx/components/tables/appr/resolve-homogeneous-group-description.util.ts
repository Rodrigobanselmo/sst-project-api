import { CharacterizationModel } from '@/@v2/documents/domain/models/characterization.model';
import { HomogeneousGroupModel } from '@/@v2/documents/domain/models/homogeneous-group.model';
import { IHierarchyMap } from '../../../converter/hierarchy.converter';

const SYNTHETIC_GHO_DESCRIPTION_PATTERN = /\(\/\/\)/;

function normalizeComparableText(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function isSyntheticHomogeneousGroupPath(description: string): boolean {
  return SYNTHETIC_GHO_DESCRIPTION_PATTERN.test(description);
}

export function matchesIdentificationText(
  candidate: string,
  identifications: string[],
): boolean {
  const normalizedCandidate = normalizeComparableText(candidate);
  if (!normalizedCandidate) return true;

  return identifications
    .map(normalizeComparableText)
    .filter(Boolean)
    .some((identification) => normalizedCandidate === identification);
}

function buildIdentificationValues(
  gho: HomogeneousGroupModel,
  hierarchy?: IHierarchyMap[string],
): string[] {
  const values = new Set<string>();

  if (gho.name?.trim()) values.add(gho.name.trim());
  if (gho.characterization?.name?.trim()) values.add(gho.characterization.name.trim());
  if (hierarchy?.name?.trim()) values.add(hierarchy.name.trim());

  const ownDescription = gho.description?.trim();
  if (ownDescription && isSyntheticHomogeneousGroupPath(ownDescription)) {
    const [nameFromPath] = ownDescription.split('(//)');
    if (nameFromPath?.trim()) values.add(nameFromPath.trim());
  }

  return [...values];
}

function resolveOwnGseDescription(
  gho: HomogeneousGroupModel,
  identifications: string[],
): string {
  const ownDescription = gho.description?.trim();
  if (!ownDescription) return '';
  if (isSyntheticHomogeneousGroupPath(ownDescription)) return '';
  if (matchesIdentificationText(ownDescription, identifications)) return '';

  return ownDescription;
}

export function resolveCharacterizationDescription(
  characterization: CharacterizationModel,
  identifications: string[] = [],
): string {
  const identificationValues = [
    ...identifications,
    characterization.name,
  ].filter(Boolean);

  const paragraphs =
    characterization.paragraphs?.map((paragraph) => paragraph?.trim()).filter(Boolean).join('\n\n') ||
    '';

  if (paragraphs && !matchesIdentificationText(paragraphs, identificationValues)) {
    return paragraphs;
  }

  const description = characterization.description?.trim() || '';
  if (description && !matchesIdentificationText(description, identificationValues)) {
    return description;
  }

  return '';
}

export function resolveHomogeneousGroupInventoryDescription(
  gho: HomogeneousGroupModel,
  hierarchyTree?: IHierarchyMap,
): string {
  const hierarchy = hierarchyTree?.[gho.id] || hierarchyTree?.[gho.name];
  const identifications = buildIdentificationValues(gho, hierarchy);

  const ownDescription = resolveOwnGseDescription(gho, identifications);
  if (ownDescription) return ownDescription;

  if (gho.characterization) {
    const characterizationDescription = resolveCharacterizationDescription(
      gho.characterization,
      identifications,
    );

    if (characterizationDescription) return characterizationDescription;
  }

  return '';
}
