import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum";
import { IOrderBy } from "@/@v2/shared/types/order-by.types";

export enum HierarchyOrderByEnum {
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
  NAME = 'NAME',
  PARENT_NAME_1 = 'PARENT_1',
  PARENT_NAME_2 = 'PARENT_2',
  PARENT_NAME_3 = 'PARENT_3',
  PARENT_NAME_4 = 'PARENT_4',
  PARENT_NAME_5 = 'PARENT_5',
  TYPE = 'TYPE',
}

export namespace IHierarchyDAO {
  export type BrowseParams = {
    orderBy?: IOrderBy<HierarchyOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      search?: string;
      workspaceIds?: string[];
      type?: HierarchyTypeEnum[];
    };
  }
}

