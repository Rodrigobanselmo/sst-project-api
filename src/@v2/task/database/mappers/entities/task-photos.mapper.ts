import { TaskPhotoEntity } from '@/@v2/task/domain/entities/task-photo.entity';
import { TaskPhoto } from '@prisma/client';

export type ITaskPhotosEntityMapper = TaskPhoto;

export class TaskPhotosMapper {
  static toEntity(data: ITaskPhotosEntityMapper): TaskPhotoEntity {
    return new TaskPhotoEntity({
      fileId: data.file_id,
    });
  }

  static toEntities(data: ITaskPhotosEntityMapper[]): TaskPhotoEntity[] {
    return data.map((item) => this.toEntity(item));
  }
}
