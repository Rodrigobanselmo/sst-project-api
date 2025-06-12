import { ActionPlanOrderByEnum } from '@/@v2/security/action-plan/database/dao/action-plan/action-plan.types';
import { ActionPlanStatusEnum } from '@/@v2/security/action-plan/domain/enums/action-plan-status.enum';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { IRiskLevelValues } from '@/@v2/shared/domain/types/security/risk-level-values.type';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';

export namespace IBrowseActionPlanUseCase {
  export type Params = {
    companyId: string;
    workspaceId: string;
    search?: string;
    orderBy?: IOrderBy<ActionPlanOrderByEnum>;
    pagination: IPagination;
    status?: ActionPlanStatusEnum[];
    responsibleIds?: number[];
    occupationalRisks?: IRiskLevelValues[];
    isExpired?: boolean;
    hierarchyIds?: string[];
    recommendationIds?: string[];
    generateSourceIds?: string[];
    riskIds?: string[];
    riskTypes?: RiskTypeEnum[];
    riskSubTypes?: number[];
  };
}
