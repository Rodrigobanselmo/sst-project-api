import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { asyncBatch } from '@/shared/utils/asyncBatch';
import { Inject } from '@nestjs/common';
import { IDonwloadImage } from './donwload-image.interface';

export abstract class DonwloadImageService {
  constructor(
    @Inject(SharedTokens.Storage)
    private readonly storage: IStorageAdapter,
  ) { }

  public async donwloadBatch<T, S>({ images, callbackFn, getUrl }: IDonwloadImage.ParamsBatch<T, S>) {

    return await asyncBatch(images, 50, async (image) => {
      const url = getUrl(image);
      const path = await this.donwload({ imageUrl: url });

      return callbackFn(path, image);
    });
  }

  public async donwload({ imageUrl }: IDonwloadImage.Params): Promise<string | null> {
    if (!imageUrl) return null;

    return 'images/mock/placeholder-image.png'
  }
}
