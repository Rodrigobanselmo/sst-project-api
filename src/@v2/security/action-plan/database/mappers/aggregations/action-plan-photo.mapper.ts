import { ActionPlanPhotoAggregate } from '../../../domain/aggregations/action-plan-photo.aggregate';
import { ActionPlanPhotoEntityMapper, IActionPlanPhotoEntityMapper } from '../entities/action-plan-photo.mapper';
import { ActionPlanMapper, IActionPlanEntityMapper } from '../entities/action-plan.mapper';

type IActionPlanPhotoAggregateMapper = IActionPlanPhotoEntityMapper & {
  risk_data_rec: IActionPlanEntityMapper & {
    company: {
      documentData: {
        months_period_level_2: number;
        months_period_level_3: number;
        months_period_level_4: number;
        months_period_level_5: number;
        validityStart: Date | null;
      }[];
    };
    riskFactorData: {
      level: number | null;
    };
  };
};

export class ActionPlanPhotoAggregateMapper {
  static toAggregate(data: IActionPlanPhotoAggregateMapper): ActionPlanPhotoAggregate {
    const documentData = data.risk_data_rec.company.documentData?.[0];
    const dataRec = data.risk_data_rec;

    return new ActionPlanPhotoAggregate({
      actionPlan: ActionPlanMapper.toEntity(dataRec, {
        documentData,
        level: data.risk_data_rec.riskFactorData.level,
      }),
      photo: ActionPlanPhotoEntityMapper.toEntity(data),
    });
  }
}
