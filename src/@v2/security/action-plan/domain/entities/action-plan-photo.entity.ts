import { SystemFile } from '@/@v2/shared/domain/types/shared/system-file';

export type IActionPlanPhotoEntity = {
  id?: string;
  isVertical: boolean;
  file: SystemFile;
};

export class ActionPlanPhotoEntity {
  readonly id: string | null;
  readonly isVertical: boolean;
  readonly file: SystemFile;

  constructor(params: IActionPlanPhotoEntity) {
    this.id = params.id || null;
    this.isVertical = params.isVertical;
    this.file = params.file;
  }
}
