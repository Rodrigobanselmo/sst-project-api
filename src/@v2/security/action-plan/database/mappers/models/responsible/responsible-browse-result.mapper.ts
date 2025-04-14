import { ResponsibleBrowseResultModel } from '@/@v2/security/action-plan/domain/models/responsible/responsible-browse-result.model';

export type IResponsibleBrowseResultModelMapper = {
  user_id: number | null;
  employee_id: number | null;
  row_name: string;
  row_email: string | null;
};

export class ResponsibleBrowseResultModelMapper {
  static toModel(prisma: IResponsibleBrowseResultModelMapper): ResponsibleBrowseResultModel {
    return new ResponsibleBrowseResultModel({
      userId: prisma.user_id || undefined,
      employeeId: prisma.employee_id || undefined,
      email: prisma.row_email || '',
      name: prisma.row_name,
    });
  }

  static toModels(prisma: IResponsibleBrowseResultModelMapper[]): ResponsibleBrowseResultModel[] {
    return prisma.map((rec) => ResponsibleBrowseResultModelMapper.toModel(rec));
  }
}
