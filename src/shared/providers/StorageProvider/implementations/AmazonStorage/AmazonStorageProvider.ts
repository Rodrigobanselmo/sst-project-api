import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import MimeClass from '../../../../../shared/utils/mime';
import { FileStorage, IStorageProvider } from '../../models/StorageProvider.types';
import { Readable } from 'stream';

export class AmazonStorageProvider implements IStorageProvider {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor() {
    this.s3 = new S3Client({ region: process.env.AWS_BUCKET_REGION });
    this.bucket = process.env.AWS_S3_BUCKET;
  }

  async upload({ file, fileName, isPublic }: FileStorage.Upload.Params): Promise<FileStorage.Upload.Result> {
    const key = process.env.APP_HOST.includes('localhost') ? `${'test'}/${fileName}` : fileName;

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

  async uploadLarge({ file, fileName, isPublic }: FileStorage.Upload.Params): Promise<FileStorage.Upload.Result> {
    const key = process.env.APP_HOST.includes('localhost') ? `${'test'}/${fileName}` : fileName;

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

  async download({ fileKey }: FileStorage.Download.Params): Promise<FileStorage.Download.Result> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    });

    const fileStream = await this.s3.send(command);

    return {
      file: Readable.from(this.toReadable(fileStream.Body.transformToWebStream())),
    };
  }

  async delete({ fileName }: FileStorage.Delete.Params): Promise<FileStorage.Delete.Result> {
    if (process.env.APP_HOST.includes('localhost') && !fileName.includes('test')) return;

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
    });

    await this.s3.send(command);
  }

  private contentType(filename: string): string {
    const extension = filename.split('.').pop();
    const mime = new MimeClass();
    const contentType = mime.toContentType(extension);
    if (!contentType) throw new Error('Unsupported file type');
    return contentType;
  }

  private getLocation(key: string): string {
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  private toReadable(stream: ReadableStream): Readable {
    const reader = stream.getReader();
    return new Readable({
      async read(size) {
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
