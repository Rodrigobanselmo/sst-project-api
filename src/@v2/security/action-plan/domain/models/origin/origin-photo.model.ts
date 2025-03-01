export type IOriginPhotoModel = {
  id: string;
  name: string;
  isVertical: boolean;
  url: string;
};

export class OriginPhotoModel {
  id: string;
  name: string;
  isVertical: boolean;
  url: string;

  constructor(params: IOriginPhotoModel) {
    this.id = params.id;
    this.name = params.name;
    this.isVertical = params.isVertical;
    this.url = params.url;
  }
}
