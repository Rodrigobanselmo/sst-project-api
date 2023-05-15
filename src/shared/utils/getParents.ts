import { HierarchyEntity } from '../../modules/company/entities/hierarchy.entity';

export function getHierarchyParents(hierarchies: HierarchyEntity[], id: HierarchyEntity['id']) {
  const parents: HierarchyEntity[] = [];

  let hierarchy = id ? hierarchies.find((h) => h.id === id) : null;
  const actualHierarchy = hierarchy;

  while (hierarchy) {
    hierarchy = hierarchies.find((h) => h.id === hierarchy?.parentId);
    if (hierarchy) parents.push(hierarchy);
  }
  return { parents, actualHierarchy };
}

export function getHierarchyParentsFromMap(hierarchies: Record<number, HierarchyEntity>, id: HierarchyEntity['id']) {
  const parents: HierarchyEntity[] = [];

  let hierarchy = id ? hierarchies[id] : null;
  const actualHierarchy = hierarchy;

  while (hierarchy) {
    hierarchy = hierarchies[hierarchy?.parentId];
    if (hierarchy) parents.push(hierarchy);
  }
  return { parents, actualHierarchy };
}
