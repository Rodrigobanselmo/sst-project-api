import { SystemFileMapper, SystemFileMapperConstructor } from '@/@v2/shared/utils/mappers/system-file.mapper';
import { ActionPlanPhotoEntity } from '../../../domain/entities/action-plan-photo.entity';

export type IActionPlanPhotoEntityMapper = {
  id: string;
  is_vertical: boolean;
  file: SystemFileMapperConstructor;
};

export class ActionPlanPhotoEntityMapper {
  static toEntity(prisma: IActionPlanPhotoEntityMapper): ActionPlanPhotoEntity {
    return new ActionPlanPhotoEntity({
      id: prisma.id,
      file: SystemFileMapper.toClass(prisma.file),
      isVertical: prisma.is_vertical,
    });
  }
}
