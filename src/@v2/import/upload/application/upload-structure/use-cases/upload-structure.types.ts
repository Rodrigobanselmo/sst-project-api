export namespace IUploadStructureUseCase {
  export type Params = {
    companyId: string;
    buffer: Buffer;
    createHierarchyIfNotExists: boolean | undefined;
    createHomogeneousGroupIfNotExists: boolean | undefined;
    createEmployeeIfNotExists: boolean | undefined;
    linkHierarchyToHomogeneousGroupIfNotExists: boolean | undefined;
    stopOnFirstError: boolean | undefined;
  };
}
