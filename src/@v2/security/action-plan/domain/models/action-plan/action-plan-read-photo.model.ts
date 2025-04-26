export type IActionPlanPhotoModel = {
  id: string;
  name: string;
  isVertical: boolean;
  url: string;
  isVisible?: boolean;
};

export class ActionPlanReadPhotoModel {
  id: string;
  name: string;
  isVertical: boolean;
  url: string;
  isVisible: boolean;

  constructor(params: IActionPlanPhotoModel) {
    this.id = params.id;
    this.name = params.name;
    this.isVertical = params.isVertical;
    this.url = params.url;
    this.isVisible = params.isVisible ?? true;
  }
}
