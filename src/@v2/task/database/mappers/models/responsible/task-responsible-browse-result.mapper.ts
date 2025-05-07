import { TaskResponsibleBrowseResultModel } from '@/@v2/task/domain/models/responsible/task-responsible-browse-result.model';

export type ITaskResponsibleBrowseResultModelMapper = {
  user_id: number | null;
  employee_id: number | null;
  row_name: string;
  row_email: string | null;
};

export class TaskResponsibleBrowseResultModelMapper {
  static toModel(prisma: ITaskResponsibleBrowseResultModelMapper): TaskResponsibleBrowseResultModel {
    return new TaskResponsibleBrowseResultModel({
      userId: prisma.user_id || undefined,
      employeeId: prisma.employee_id || undefined,
      email: prisma.row_email || undefined,
      name: prisma.row_name,
    });
  }

  static toModels(prisma: ITaskResponsibleBrowseResultModelMapper[]): TaskResponsibleBrowseResultModel[] {
    return prisma.map((rec) => TaskResponsibleBrowseResultModelMapper.toModel(rec));
  }
}
