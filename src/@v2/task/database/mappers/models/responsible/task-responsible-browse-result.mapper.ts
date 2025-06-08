import { TaskResponsibleBrowseResultModel } from '@/@v2/task/domain/models/responsible/task-responsible-browse-result.model';

export type ITaskResponsibleBrowseResultModelMapper = {
  user_ids: number[];
  employee_ids: number[];
  row_name: string;
  row_email: string | null;
};

export class TaskResponsibleBrowseResultModelMapper {
  static toModel(prisma: ITaskResponsibleBrowseResultModelMapper): TaskResponsibleBrowseResultModel {
    return new TaskResponsibleBrowseResultModel({
      id: prisma.user_ids?.[0] || undefined,
      employeeId: prisma.employee_ids?.[0] || undefined,
      email: prisma.row_email || undefined,
      name: prisma.row_name,
    });
  }

  static toModels(prisma: ITaskResponsibleBrowseResultModelMapper[]): TaskResponsibleBrowseResultModel[] {
    return prisma.map((rec) => TaskResponsibleBrowseResultModelMapper.toModel(rec));
  }
}
