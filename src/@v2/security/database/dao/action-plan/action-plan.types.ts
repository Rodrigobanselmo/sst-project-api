import { IOrderBy } from "@/@v2/shared/types/order-by.types";

export enum ActionPlanOrderByEnum {
  ORIGIN = 'ORIGIN',
  ORIGIN_TYPE = 'ORIGIN_TYPE',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
  LEVEL = 'LEVEL',
  RECOMMENDATION = 'RECOMMENDATION',
  RISK = 'RISK',
  STATUS = 'STATUS',
  START_DATE = 'START_DATE',
  DONE_DATE = 'DONE_DATE',
  CANCEL_DATE = 'CANCEL_DATE',
  VALID_DATE = 'VALID_DATE',
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

