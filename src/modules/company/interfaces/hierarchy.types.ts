import { Hierarchy } from '@prisma/client';

export type IHierarchyTree = Record<
  string,
  Hierarchy & {
    children: (string | number)[];
  }
>;
