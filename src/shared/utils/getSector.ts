import { HierarchyEntity } from './../../modules/company/entities/hierarchy.entity';

export const getSector = (hierarchy: Partial<HierarchyEntity>): HierarchyEntity => {
  return hierarchy?.parents?.find((parent) => parent.type == 'SECTOR');
};
