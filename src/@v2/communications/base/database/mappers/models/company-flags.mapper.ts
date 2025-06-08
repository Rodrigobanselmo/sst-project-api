import { CompanyFlags } from '@prisma/client';
import { CompanyFlagsModel } from '../../../domain/models/company-flags.model';

export type ICompanyFlagsModelMapper = CompanyFlags | null;

export class CompanyFlagsModelMapper {
  static toModel(data: ICompanyFlagsModelMapper): CompanyFlagsModel {
    return new CompanyFlagsModel({
      actionPlanNotificationsEnabled: data?.action_plan_notifications_enabled || false,
    });
  }
}
