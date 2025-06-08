export type ICompanyFlagsModel = {
  actionPlanNotificationsEnabled: boolean;
};

export class CompanyFlagsModel {
  actionPlanNotificationsEnabled: boolean;

  constructor(params: ICompanyFlagsModel) {
    this.actionPlanNotificationsEnabled = params.actionPlanNotificationsEnabled;
  }
}
