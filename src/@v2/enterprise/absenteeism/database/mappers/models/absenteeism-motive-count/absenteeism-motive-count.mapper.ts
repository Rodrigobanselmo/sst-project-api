import { AbsenteeismMotiveCountReadModel } from '@/@v2/enterprise/absenteeism/domain/models/read-absenteeism-motive-count/read-absenteeism-motive-count.model';
import { AbsenteeismMotiveCountResultReadModelMapper, IAbsenteeismMotiveCountResultReadModelMapper } from './absenteeism-motive-count-result.mapper';

export type IAbsenteeismMotiveCountReadModelMapper = {
  results: IAbsenteeismMotiveCountResultReadModelMapper[];
};

export class AbsenteeismMotiveCountReadModelMapper {
  static toModel(prisma: IAbsenteeismMotiveCountReadModelMapper): AbsenteeismMotiveCountReadModel {
    return new AbsenteeismMotiveCountReadModel({
      results: AbsenteeismMotiveCountResultReadModelMapper.toModels(prisma.results),
    });
  }
}
