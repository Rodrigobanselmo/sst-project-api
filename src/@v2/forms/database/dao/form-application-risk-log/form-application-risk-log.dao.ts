import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IFormApplicationRiskLogDAO } from './form-application-risk-log.types';
import { FormApplicationRiskLogBrowseModelMapper } from '../../mappers/models/form-application-risk-log/form-application-risk-log-browse.mapper';

@Injectable()
export class FormApplicationRiskLogDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browseByApplication(params: IFormApplicationRiskLogDAO.BrowseByApplicationParams) {
    const formApplicationRiskLogs = await this.prisma.formApplicationRiskLog.findMany({
      where: {
        form_application_id: params.applicationId,
        form_application: {
          company_id: params.companyId,
        },
      },
      select: {
        risk_id: true,
        entity_id: true,
        probability: true,
      },
      distinct: ['risk_id', 'entity_id', 'probability'],
    });

    return FormApplicationRiskLogBrowseModelMapper.toModels(formApplicationRiskLogs);
  }
}
