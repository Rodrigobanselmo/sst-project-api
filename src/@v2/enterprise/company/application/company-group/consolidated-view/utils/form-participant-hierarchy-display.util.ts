import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

type HierarchyNode = {
  id: string;
  name: string;
  type: HierarchyTypeEnum;
};

export function getFormParticipantSectorLabel(
  hierarchies: HierarchyNode[],
  hierarchyName: string,
): string {
  const sub = hierarchies.find((node) => node.type === HierarchyTypeEnum.SUB_SECTOR);
  const sector = hierarchies.find((node) => node.type === HierarchyTypeEnum.SECTOR);

  if (sub?.name) return sub.name;
  if (sector?.name) return sector.name;

  const chain = hierarchies
    .map((node) => node.name)
    .reverse()
    .join(' / ');

  return chain || hierarchyName || '—';
}

export function getFormParticipantHierarchyLabel(
  hierarchies: HierarchyNode[],
  hierarchyName: string,
): string {
  return (
    hierarchies
      .map((node) => node.name)
      .reverse()
      .join(' / ') ||
    hierarchyName ||
    '—'
  );
}

export function getFormParticipantOfficeLabel(
  hierarchies: HierarchyNode[],
): string | null {
  const office = hierarchies.find(
    (node) =>
      node.type === HierarchyTypeEnum.OFFICE ||
      node.type === HierarchyTypeEnum.SUB_OFFICE,
  );

  return office?.name?.trim() || null;
}
