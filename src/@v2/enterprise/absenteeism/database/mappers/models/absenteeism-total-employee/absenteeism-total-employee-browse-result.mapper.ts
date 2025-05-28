import { AbsenteeismTotalEmployeeResultBrowseModel } from '@/@v2/enterprise/absenteeism/domain/models/absenteeism-total-employee/absenteeism-total-employee-browse-result.model';

export type IAbsenteeismTotalEmployeeResultBrowseModelMapper = {
  employee_id: string;
  employee_name: string;
  total_absenteeism_count: number;
  total_absenteeism_days: number;
};

export class AbsenteeismTotalEmployeeResultBrowseModelMapper {
  static toModel(prisma: IAbsenteeismTotalEmployeeResultBrowseModelMapper): AbsenteeismTotalEmployeeResultBrowseModel {
    return new AbsenteeismTotalEmployeeResultBrowseModel({
      total: Number(prisma.total_absenteeism_count),
      totalDays: Number(prisma.total_absenteeism_days) / 60 / 24,
      id: Number(prisma.employee_id),
      name: prisma.employee_name,
    });
  }

  static toModels(prisma: IAbsenteeismTotalEmployeeResultBrowseModelMapper[]): AbsenteeismTotalEmployeeResultBrowseModel[] {
    return prisma.map((rec) => AbsenteeismTotalEmployeeResultBrowseModelMapper.toModel(rec));
  }
}
