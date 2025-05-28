import { AbsenteeismTimelineTotalResultReadModel } from '@/@v2/enterprise/absenteeism/domain/models/read-absenteeism-timeline-total/read-absenteeism-timeline-total-result.model';

export type IAbsenteeismTimelineTotalResultReadModelMapper = {
  absenteeism_year_month: string;
  total_absenteeism_count: number;
  total_absenteeism_minutes: number;
};

export class AbsenteeismTimelineTotalResultReadModelMapper {
  static toModel(prisma: IAbsenteeismTimelineTotalResultReadModelMapper): AbsenteeismTimelineTotalResultReadModel {
    const parts = prisma.absenteeism_year_month.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);

    return new AbsenteeismTimelineTotalResultReadModel({
      date: new Date(year, month - 1, 1),
      days: Number(prisma.total_absenteeism_minutes) / 60 / 24,
      documents: Number(prisma.total_absenteeism_count),
    });
  }

  static toModels(prisma: IAbsenteeismTimelineTotalResultReadModelMapper[]): AbsenteeismTimelineTotalResultReadModel[] {
    return prisma.map((rec) => AbsenteeismTimelineTotalResultReadModelMapper.toModel(rec));
  }
}
