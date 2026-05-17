import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

export type ParticipantHierarchySqlNode = {
  id: string | null;
  name: string | null;
  type: string | null;
};

export type ParticipantHierarchySqlRow = {
  hierarchy_id: string | null;
  hierarchy_name: string | null;
  hierarchy_type: string | null;
  h_parent_1_id: string | null;
  h_parent_1_name: string | null;
  h_parent_1_type: string | null;
  h_parent_2_id: string | null;
  h_parent_2_name: string | null;
  h_parent_2_type: string | null;
  h_parent_3_id: string | null;
  h_parent_3_name: string | null;
  h_parent_3_type: string | null;
  h_parent_4_id: string | null;
  h_parent_4_name: string | null;
  h_parent_4_type: string | null;
  h_parent_5_id: string | null;
  h_parent_5_name: string | null;
  h_parent_5_type: string | null;
};

export type ParticipantHierarchyNode = {
  id: string;
  name: string;
  type: HierarchyTypeEnum;
};

function pushHierarchyNode(
  hierarchies: ParticipantHierarchyNode[],
  node: ParticipantHierarchySqlNode,
) {
  if (!node.id || !node.name || !node.type) return;
  const type = HierarchyTypeEnum[node.type as keyof typeof HierarchyTypeEnum];
  if (!type) return;
  hierarchies.push({ id: node.id, name: node.name, type });
}

/** Mesma ordem do browse de participantes: nó do cargo + pais até 5 níveis. */
export function buildParticipantHierarchiesFromSqlRow(
  row: ParticipantHierarchySqlRow,
): ParticipantHierarchyNode[] {
  const hierarchies: ParticipantHierarchyNode[] = [];

  pushHierarchyNode(hierarchies, {
    id: row.hierarchy_id,
    name: row.hierarchy_name,
    type: row.hierarchy_type,
  });

  [
    {
      id: row.h_parent_1_id,
      name: row.h_parent_1_name,
      type: row.h_parent_1_type,
    },
    {
      id: row.h_parent_2_id,
      name: row.h_parent_2_name,
      type: row.h_parent_2_type,
    },
    {
      id: row.h_parent_3_id,
      name: row.h_parent_3_name,
      type: row.h_parent_3_type,
    },
    {
      id: row.h_parent_4_id,
      name: row.h_parent_4_name,
      type: row.h_parent_4_type,
    },
    {
      id: row.h_parent_5_id,
      name: row.h_parent_5_name,
      type: row.h_parent_5_type,
    },
  ].forEach((parent) => pushHierarchyNode(hierarchies, parent));

  return hierarchies;
}
