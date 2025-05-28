import { AbsenteeismMotiveCountResultReadModel } from '@/@v2/enterprise/absenteeism/domain/models/read-absenteeism-motive-count/read-absenteeism-motive-count-result.model';

export type IAbsenteeismMotiveCountResultReadModelMapper = {
  motive_description: string;
  motive_id: number;
  count: number;
};

export class AbsenteeismMotiveCountResultReadModelMapper {
  static toModel(prisma: IAbsenteeismMotiveCountResultReadModelMapper): AbsenteeismMotiveCountResultReadModel {
    return new AbsenteeismMotiveCountResultReadModel({
      count: Number(prisma.count),
      type: prisma.motive_description,
    });
  }

  static toModels(prisma: IAbsenteeismMotiveCountResultReadModelMapper[]): AbsenteeismMotiveCountResultReadModel[] {
    return prisma.map((rec) => AbsenteeismMotiveCountResultReadModelMapper.toModel(rec));
  }
}
