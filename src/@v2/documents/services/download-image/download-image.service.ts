import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { donwloadPublicFile } from '@/@v2/shared/utils/helpers/downalod-public-file';
import { isHidePhotos } from '@/@v2/shared/utils/helpers/is-development';
import { asyncBatch } from '@/shared/utils/asyncBatch';
import { Inject, Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { v4 } from 'uuid';
import { IDownloadImage } from './download-image.interface';

@Injectable()
export class DownloadImageService {
  constructor(
    @Inject(SharedTokens.Storage)
    private readonly storage: IStorageAdapter,
  ) {}

  async downloadBatch<T, S>({ images, callbackFn, getUrl }: IDownloadImage.DownloadBatchParams<T, S>) {
    return await asyncBatch(images, 50, async (image) => {
      const url = getUrl(image);
      const path = await this.download({ imageUrl: url });

      return callbackFn(path, image);
    });
  }

  async download({ imageUrl }: IDownloadImage.DownloadParams): Promise<string | null> {

    if (isHidePhotos()) {
      return null;
    }
    if (!imageUrl) {
      return null;
    }

    // Check if URL is from our S3 bucket (handles both URL formats)
    const isS3Bucket = imageUrl.includes('simplesst.s3.amazonaws.com') || imageUrl.includes('simplesst.s3.sa-east-1');

    if (!isS3Bucket) {
      const result = await donwloadPublicFile({ url: imageUrl });
      return result;
    }

    const extension = imageUrl.split('/').at(-1)?.split('.')[1];
    if (!extension) {
      return null;
    }

    const fileKey = imageUrl.split('.com/').at(-1) || '';

    try {
      const fileStream = await this.storage.download({ fileKey: fileKey });
      const path = `tmp/${v4()}.${extension}`;
      await pipeline(fileStream, createWriteStream(path));
      return path;
    } catch (error) {
      const result = await donwloadPublicFile({ url: imageUrl });
      return result;
    }
  }
}
