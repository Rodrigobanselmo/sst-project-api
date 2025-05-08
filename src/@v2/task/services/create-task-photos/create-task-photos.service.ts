import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { IFileRequester } from '@/@v2/shared/requesters/files/file.interface';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { TaskPhotoEntity } from '@/@v2/task/domain/entities/task-photo.entity';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ITaskService } from './create-task-photos.types';

@Injectable()
export class CreateTaskPhotosService {
  constructor(
    @Inject(SharedTokens.FileRequester)
    private readonly fileRequester: IFileRequester,
  ) {}

  async create(params: ITaskService.Params): Promise<TaskPhotoEntity[]> {
    return await asyncBatch({
      items: params.photos || [],
      batchSize: 10,
      callback: async (photo) => {
        const [file, error] = await this.fileRequester.read({
          fileId: photo.fileId,
          companyId: params.companyId,
        });

        if (error) throw new BadRequestException(error.message);
        if (!file) throw new BadRequestException('Arquivo não encontrado');

        return new TaskPhotoEntity({ fileId: file.id });
      },
    });
  }
}
