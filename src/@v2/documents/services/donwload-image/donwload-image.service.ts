import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { donwloadPublicFile } from '@/@v2/shared/utils/helpers/downalod-public-file';
import { isDevelopment } from '@/@v2/shared/utils/helpers/is-development';
import { asyncBatch } from '@/shared/utils/asyncBatch';
import { Inject, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { v4 } from 'uuid';
import { IDonwloadImage } from './donwload-image.interface';

@Injectable()
export class DownloadImageService {
  constructor(
    @Inject(SharedTokens.Storage)
    private readonly storage: IStorageAdapter,
  ) {}

  async donwloadBatch<T, S>({ images, callbackFn, getUrl }: IDonwloadImage.DownloadBatchParams<T, S>) {
    return await asyncBatch(images, 50, async (image) => {
      const url = getUrl(image);
      const path = await this.donwload({ imageUrl: url });

      return callbackFn(path, image);
    });
  }

  async donwload({ imageUrl }: IDonwloadImage.DownloadParams): Promise<string | null> {
    if (isDevelopment()) return null;
    if (!imageUrl) return null;

    const isOldBucket = !imageUrl.includes('https://simplesst.s3.sa-east-1');

    if (isOldBucket) {
      return donwloadPublicFile({ url: imageUrl });
    }

    const extension = imageUrl.split('/').at(-1)?.split('.')[1];
    if (!extension) return null;

    const fileKey = imageUrl.split('.com/').at(-1) || '';
    const fileBuffer = await this.storage.download({ fileKey: fileKey });

    const path = `tmp/${v4()}.${extension}`;

    await fs.writeFile(path, fileBuffer, {});

    return path;
  }
}
