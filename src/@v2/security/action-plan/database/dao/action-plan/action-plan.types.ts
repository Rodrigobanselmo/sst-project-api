import { ActionPlanStatusEnum } from '@/@v2/security/action-plan/domain/enums/action-plan-status.enum';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { ActionPlanUserRulesVO } from '../../../domain/values-objects/action-plan-user-rules';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';

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
  RESPONSIBLE = 'RESPONSIBLE',
}

export namespace IActionPlanDAO {
  export type FindParams = {
    companyId: string;
    workspaceId: string;
    riskDataId: string;
    recommendationId: string;
  };

  export type BrowseParams = {
    orderBy?: IOrderBy<ActionPlanOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      search?: string;
      status?: ActionPlanStatusEnum[];
      responsibleIds?: number[];
      workspaceIds?: string[];
      hierarchyIds?: string[];
      recommendationIds?: string[];
      generateSourceIds?: string[];
      riskIds?: string[];
      riskTypes?: RiskTypeEnum[];
      riskSubTypes?: number[];
      occupationalRisks?: number[];
      isStarted?: boolean;
      isDone?: boolean;
      isCanceled?: boolean;
      isExpired?: boolean;
      rules?: ActionPlanUserRulesVO;
    };
  };
}
