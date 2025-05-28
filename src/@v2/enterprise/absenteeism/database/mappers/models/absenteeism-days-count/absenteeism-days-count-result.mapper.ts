import { AbsenteeismDaysCountResultReadModel } from '@/@v2/enterprise/absenteeism/domain/models/read-absenteeism-days-count/read-absenteeism-days-count-result.model';

export type IAbsenteeismDaysCountResultReadModelMapper = {
  range_string: string;
  count: number;
};

export class AbsenteeismDaysCountResultReadModelMapper {
  static toModel(prisma: IAbsenteeismDaysCountResultReadModelMapper): AbsenteeismDaysCountResultReadModel {
    return new AbsenteeismDaysCountResultReadModel({
      count: Number(prisma.count),
      range: prisma.range_string,
    });
  }

  static toModels(prisma: IAbsenteeismDaysCountResultReadModelMapper[]): AbsenteeismDaysCountResultReadModel[] {
    return prisma.map((rec) => AbsenteeismDaysCountResultReadModelMapper.toModel(rec));
  }
}
