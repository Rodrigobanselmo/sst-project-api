import { EffectivenessStatusEnum } from '../../enums/effectiveness-status.enum';

export type IActionPlanEffectivenessModel = {
  status: EffectivenessStatusEnum;
  date: Date | null;
  comment: string | null;
  evaluatedBy: { id: string; name: string } | null;
};

export class ActionPlanEffectivenessModel {
  status: EffectivenessStatusEnum;
  date: Date | null;
  comment: string | null;
  evaluatedBy: { id: string; name: string } | null;

  constructor(params: IActionPlanEffectivenessModel) {
    this.status = params.status;
    this.date = params.date;
    this.comment = params.comment;
    this.evaluatedBy = params.evaluatedBy;
  }
}
