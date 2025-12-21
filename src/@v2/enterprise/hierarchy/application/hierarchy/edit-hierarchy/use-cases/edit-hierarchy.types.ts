export namespace IEditHierarchyUseCase {
  export type Params = {
    id: string;
    companyId: string;
    name?: string;
    description?: string | null;
    realDescription?: string | null;
    metadata?: Record<string, unknown> | null;
  };
}
