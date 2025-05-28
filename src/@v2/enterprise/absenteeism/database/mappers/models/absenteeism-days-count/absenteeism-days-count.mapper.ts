import { AbsenteeismDaysCountReadModel } from '@/@v2/enterprise/absenteeism/domain/models/read-absenteeism-days-count/read-absenteeism-days-count.model';
import { AbsenteeismDaysCountResultReadModelMapper, IAbsenteeismDaysCountResultReadModelMapper } from './absenteeism-days-count-result.mapper';

export type IAbsenteeismDaysCountReadModelMapper = {
  results: IAbsenteeismDaysCountResultReadModelMapper[];
};

export class AbsenteeismDaysCountReadModelMapper {
  static toModel(prisma: IAbsenteeismDaysCountReadModelMapper): AbsenteeismDaysCountReadModel {
    return new AbsenteeismDaysCountReadModel({
      results: AbsenteeismDaysCountResultReadModelMapper.toModels(prisma.results),
    });
  }
}
