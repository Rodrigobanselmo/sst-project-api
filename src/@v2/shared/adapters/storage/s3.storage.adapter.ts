import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { config } from '@/@v2/shared/constants/config';
import { isDevelopment } from '@/@v2/shared/utils/helpers/is-development';
import { getContentType } from '@/@v2/shared/utils/helpers/get-content-type';
import { Readable } from 'stream';
import { IStorageAdapter } from './storage.interface';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3StorageAdapter implements IStorageAdapter {
  private readonly bucket: string;
  private readonly s3: S3Client;

  constructor() {
    this.bucket = config.AWS.S3_BUCKET;
    this.s3 = new S3Client({ region: config.AWS.S3_BUCKET_REGION });
  }

  async upload({ file, fileFolder, fileName, bucket, isPublic }: IStorageAdapter.Upload.Params): Promise<IStorageAdapter.Upload.Result> {
    const name = this.normalizeFileName(fileName);
    const key = isDevelopment() ? `${'test'}/${fileFolder}${name}` : `${fileFolder}${name}`;
    const bucketName = bucket || this.bucket;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: this.contentType(key),
      ACL: isPublic ? 'public-read' : undefined,
    });

    await this.s3.send(command);

    return { url: this.getLocation(key), key, bucket: bucketName };
  }

  async download({ fileKey: key, bucket }: IStorageAdapter.Download.Params): Promise<IStorageAdapter.Download.Result> {
    const command = new GetObjectCommand({
      Bucket: bucket || this.bucket,
      Key: key,
    });

    const fileStream = await this.s3.send(command);
    if (!fileStream.Body) throw new Error('Arquivo não encontrado');

    return Readable.from(this.toReadable(fileStream.Body.transformToWebStream()));
  }

  async delete({ key, bucket }: IStorageAdapter.Delete.Params): Promise<IStorageAdapter.Delete.Result> {
    const fileKey = key;
    if (isDevelopment() && !fileKey?.includes('test')) return;

    const command = new DeleteObjectCommand({
      Bucket: bucket || this.bucket,
      Key: fileKey,
    });

    await this.s3.send(command);
  }

  async generateSignedPath(params: IStorageAdapter.GenerateSignPath.Params): Promise<IStorageAdapter.GenerateSignPath.Result> {
    const { fileKey, expires = 900, bucket } = params;
    const command = new GetObjectCommand({
      Bucket: bucket || this.bucket,
      Key: fileKey,
      ResponseContentDisposition: 'inline',
      ResponseContentType: this.contentType(fileKey),
    });

    return getSignedUrl(this.s3 as any, command as any, { expiresIn: expires });
  }

  private contentType(filename: string): string {
    const extension = filename.split('.').pop();
    if (!extension) throw new Error('Arquivo com extensão inválida');

    const contentType = getContentType(extension);
    if (!contentType) throw new Error('Tipo de arquivo não suportado');

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

  private normalizeFileName = (fileName: string) =>
    fileName
      .normalize('NFD')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
}
