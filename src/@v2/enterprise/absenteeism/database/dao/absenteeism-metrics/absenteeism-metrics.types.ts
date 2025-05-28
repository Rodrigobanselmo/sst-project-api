import { AbsenteeismHierarchyTypeEnum } from '@/@v2/enterprise/absenteeism/domain/enums/absenteeism-hierarchy-type';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';

export enum AbsenteeismHierarchyTotalOrderByEnum {
  TOTAL = 'TOTAL',
  TOTAL_DAYS = 'TOTAL_DAYS',
  AVERAGE_DAYS = 'AVERAGE_DAYS',
}

export enum AbsenteeismEmployeeTotalOrderByEnum {
  TOTAL = 'TOTAL',
  TOTAL_DAYS = 'TOTAL_DAYS',
}

export namespace IAbsenteeismMetricsDAO {
  export type FilterCommonParams = {
    workspacesIds?: string[];
    hierarchiesIds?: string[];
    motivesIds?: number[];
    startDate?: Date;
    endDate?: Date;
  };

  export type ReadTimelineCountParams = {
    companyId: string;
    workspacesIds?: string[];
    hierarchiesIds?: string[];
    motivesIds?: number[];
    startDate?: Date;
    endDate?: Date;
  };

  export type ReadMotiveCountParams = {
    companyId: string;
    workspacesIds?: string[];
    hierarchiesIds?: string[];
    motivesIds?: number[];
    startDate?: Date;
    endDate?: Date;
  };

  export type ReadDaysCountParams = {
    companyId: string;
    workspacesIds?: string[];
    hierarchiesIds?: string[];
    motivesIds?: number[];
    startDate?: Date;
    endDate?: Date;
  };

  export type BrowseEmployeeTotalParams = {
    orderBy?: IOrderBy<AbsenteeismEmployeeTotalOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      search?: string;
      workspacesIds?: string[];
      hierarchiesIds?: string[];
      motivesIds?: number[];
      startDate?: Date;
      endDate?: Date;
    };
  };

  export type BrowseHierarchyTotalParams = {
    orderBy?: IOrderBy<AbsenteeismHierarchyTotalOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      search?: string;
      type?: AbsenteeismHierarchyTypeEnum;
      workspacesIds?: string[];
      hierarchiesIds?: string[];
      motivesIds?: number[];
      startDate?: Date;
      endDate?: Date;
    };
  };
}
