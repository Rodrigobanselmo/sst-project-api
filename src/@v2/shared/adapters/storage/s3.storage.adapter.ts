import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { IStorageAdapter } from './storage.interface';
import { Readable } from 'stream';
import { isDevelopment } from '@/@v2/shared/utils/helpers/is-development';
import { config } from '@/@v2/shared/constants/config';
import { toContentType } from '@/@v2/shared/utils/helpers/mime';

export class S3StorageAdapter implements IStorageAdapter {
  private readonly bucket: string;
  private readonly s3: S3Client;

  constructor() {
    this.bucket = config.AWS.S3_BUCKET;
    this.s3 = new S3Client({ region: config.AWS.S3_BUCKET_REGION });
  }

  async upload({ file, fileName, isPublic }: IStorageAdapter.Upload.Params): Promise<IStorageAdapter.Upload.Result> {
    const key = isDevelopment() ? `${'test'}/${fileName}` : fileName;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: this.contentType(fileName),
      ACL: isPublic ? 'public-read' : undefined,
    });

    await this.s3.send(command);

    return { url: this.getLocation(key), key };
  }

  async download({ fileUrl }: IStorageAdapter.Download.Params): Promise<IStorageAdapter.Download.Result> {
    const fileKey = fileUrl.split('.com/').at(-1);

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    });

    const fileStream = await this.s3.send(command);
    if (!fileStream.Body) throw new Error('File not found');

    return {
      file: Readable.from(this.toReadable(fileStream.Body.transformToWebStream())),
    };
  }

  async delete({ fileUrl }: IStorageAdapter.Delete.Params): Promise<IStorageAdapter.Delete.Result> {
    const fileKey = fileUrl.split('.com/').at(-1);
    if (isDevelopment() && !fileKey?.includes('test')) return;

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    });

    await this.s3.send(command);
  }

  private contentType(filename: string): string {
    const extension = filename.split('.').pop();
    if (!extension) throw new Error('Invalid file name');

    const contentType = toContentType(extension);
    if (!contentType) throw new Error('Unsupported file type');

    return contentType;
  }

  private getLocation(key: string): string {
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  private toReadable(stream: ReadableStream): Readable {
    const reader = stream.getReader();
    return new Readable({
      async read() {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
          return;
        }
        this.push(value);
      },
    });
  }
}
