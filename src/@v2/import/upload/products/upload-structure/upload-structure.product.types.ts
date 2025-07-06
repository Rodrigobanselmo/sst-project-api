export type IStructureProductParams = {
  companyId: string;
  createHierarchyIfNotExists: boolean | undefined;
  createHomogeneousGroupIfNotExists: boolean | undefined;
  createEmployeeIfNotExists: boolean | undefined;
  linkHierarchyToHomogeneousGroupIfNotExists: boolean | undefined;
  stopOnFirstError: boolean | undefined;
};
