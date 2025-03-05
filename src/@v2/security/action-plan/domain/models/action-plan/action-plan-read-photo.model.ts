export type IActionPlanPhotoModel = {
  id: string;
  name: string;
  isVertical: boolean;
  url: string;
};

export class ActionPlanReadPhotoModel {
  id: string;
  name: string;
  isVertical: boolean;
  url: string;

  constructor(params: IActionPlanPhotoModel) {
    this.id = params.id;
    this.name = params.name;
    this.isVertical = params.isVertical;
    this.url = params.url;
  }
}
