import { TimeCountRangeEnum } from '@/@v2/enterprise/absenteeism/constants/time-count-range';
import { AbsenteeismHierarchyTypeEnum } from '@/@v2/enterprise/absenteeism/domain/enums/absenteeism-hierarchy-type';

export namespace IAbsenteeismUseCase {
  export type Params = {
    companyId: string;
    range: TimeCountRangeEnum;
    items: {
      id: string;
      type: AbsenteeismHierarchyTypeEnum;
    }[];
  };
}
