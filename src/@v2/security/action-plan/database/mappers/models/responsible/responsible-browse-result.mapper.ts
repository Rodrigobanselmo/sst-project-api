import { ResponsibleBrowseResultModel } from '@/@v2/security/action-plan/domain/models/responsible/responsible-browse-result.model';

export type IResponsibleBrowseResultModelMapper = {
  user_ids: number[];
  employee_ids: number[];
  row_name: string;
  row_email: string | null;
};

export class ResponsibleBrowseResultModelMapper {
  static toModel(prisma: IResponsibleBrowseResultModelMapper): ResponsibleBrowseResultModel {
    return new ResponsibleBrowseResultModel({
      userId: prisma.user_ids?.[0] || undefined,
      employeeId: prisma.employee_ids?.[0] || undefined,
      email: prisma.row_email || undefined,
      name: prisma.row_name,
    });
  }

  static toModels(prisma: IResponsibleBrowseResultModelMapper[]): ResponsibleBrowseResultModel[] {
    return prisma.map((rec) => ResponsibleBrowseResultModelMapper.toModel(rec));
  }
}
