import { IOrderBy } from "@/@v2/shared/types/order-by.types";

export enum ActionPlanOrderByEnum {
  NAME = 'NAME',
  CREATED_AT = 'CREATED_AT',
  TYPE = 'TYPE',
  UPDATED_AT = 'UPDATED_AT',
  DONE_AT = 'DONE_AT',
  STAGE = 'STAGE',
  ORDER = 'ORDER',
  PHOTOS = 'PHOTOS',
  RISKS = 'RISKS',
  HIERARCHY = 'HIERARCHY',
  PROFILES = 'PROFILES',
}

export namespace IActionPlanDAO {
  export type BrowseParams = {
    orderBy?: IOrderBy<ActionPlanOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      workspaceIds?: string[];
      search?: string;
      stageIds?: number[];
    };
  }
}

