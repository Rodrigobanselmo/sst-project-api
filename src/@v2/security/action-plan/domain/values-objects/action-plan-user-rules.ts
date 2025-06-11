import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';

export type IAccessParams<T = string> = { type: 'restrict' | 'allow'; value: T[] | 'all' };

export type IHierarchyAccess = 'all' | string[];

export interface IActionPlanUserRulesVO {
  allowedHierarchyAccess: IHierarchyAccess;
  allowedRiskType: RiskTypeEnum[];
  allowedRiskSubTypeIds: number[];

  restrictedHierarchyAccess: IHierarchyAccess;
  restrictedRiskType: RiskTypeEnum[];
  restrictedRiskSubTypeIds: number[];
}

export class ActionPlanUserRulesVO {
  private readonly allowedHierarchyAccess: IHierarchyAccess;
  private readonly allowedRiskType: RiskTypeEnum[];
  private readonly allowedRiskSubTypeIds: number[];

  private readonly restrictedHierarchyAccess?: IHierarchyAccess;
  private readonly restrictedRiskType: RiskTypeEnum[];
  private readonly restrictedRiskSubTypeIds: number[];

  constructor(params: IActionPlanUserRulesVO) {
    this.allowedHierarchyAccess = params.allowedHierarchyAccess || [];
    this.allowedRiskType = params.allowedRiskType || [];
    this.allowedRiskSubTypeIds = params.allowedRiskSubTypeIds || [];

    this.restrictedHierarchyAccess = params.restrictedHierarchyAccess || [];
    this.restrictedRiskType = params.restrictedRiskType || [];
    this.restrictedRiskSubTypeIds = params.restrictedRiskSubTypeIds || [];
  }

  public get hierarchyAccess(): IAccessParams<string> {
    const allowAll = this.allowedHierarchyAccess === 'all';
    if (allowAll) {
      return { type: 'allow', value: 'all' };
    }

    const allowSome = this.allowedHierarchyAccess.length > 0;
    if (allowSome) {
      return { type: 'allow', value: this.allowedHierarchyAccess };
    }

    const restrictAll = this.restrictedHierarchyAccess === 'all';
    if (restrictAll) {
      return { type: 'restrict', value: 'all' };
    }

    const restrictSome = this.restrictedHierarchyAccess.length > 0;
    if (restrictSome) {
      return { type: 'restrict', value: this.restrictedHierarchyAccess };
    }

    return {
      type: 'allow',
      value: 'all',
    };
  }

  public get riskTypeAccess(): IAccessParams<RiskTypeEnum> {
    if (this.allowedRiskType.length > 0) {
      return { type: 'allow', value: this.allowedRiskType };
    }

    if (this.restrictedRiskType.length > 0) {
      return { type: 'restrict', value: this.restrictedRiskType };
    }

    return { type: 'allow', value: 'all' };
  }

  public get riskSubTypeAccess(): IAccessParams<number> {
    if (this.allowedRiskSubTypeIds.length > 0) {
      return { type: 'allow', value: this.allowedRiskSubTypeIds };
    }

    if (this.restrictedRiskSubTypeIds.length > 0) {
      return { type: 'restrict', value: this.restrictedRiskSubTypeIds };
    }

    return { type: 'allow', value: 'all' };
  }

  public get hasAnyRule(): boolean {
    return this.riskTypeAccess.value !== 'all' || this.hierarchyAccess.value !== 'all' || this.riskSubTypeAccess.value !== 'all';
  }
}
