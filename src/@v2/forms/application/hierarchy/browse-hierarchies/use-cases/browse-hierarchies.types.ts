import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

export namespace IBrowseHierarchiesUseCase {
  export type Params = {
    companyId: string;
    type?: HierarchyTypeEnum[];
    parent?: string;
    search?: string;
    workspaceIds?: string[];
    pagination?: {
      page?: number;
      limit?: number;
    };
  };

  export type Result = {
    id: string;
    name: string;
    type: HierarchyTypeEnum;
    parentId?: string;
  };
}
