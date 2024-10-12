import { IOrderBy } from "@/@v2/shared/types/order-by.types";

export enum CharacterizationOrderByEnum {
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

export namespace ICharacterizationDAO {
  export type BrowseParams = {
    orderBy?: IOrderBy<CharacterizationOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      workspaceId: string;
      search?: string;
    };
  }
}

