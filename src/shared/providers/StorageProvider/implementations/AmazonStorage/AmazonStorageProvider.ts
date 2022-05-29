import * as AWS from 'aws-sdk';
import MimeClass from 'src/shared/utils/mime';
import {
  FileStorage,
  IStorageProvider,
} from '../../models/StorageProvider.types';

export class AmazonStorageProvider implements IStorageProvider {
  private readonly s3: AWS.S3;
  private readonly bucket: string;

  constructor() {
    this.s3 = new AWS.S3({ region: process.env.AWS_BUCKET_REGION });
    this.bucket = process.env.AWS_S3_BUCKET;
  }

  async upload({
    file,
    fileName,
  }: FileStorage.Upload.Params): Promise<FileStorage.Upload.Result> {
    const { Location: url } = await this.s3
      .upload({
        Bucket: this.bucket,
        Key: fileName,
        Body: file,
        ContentType: this.contentType(fileName),
      })
      .promise();
    return { url };
  }

  download({
    fileKey,
  }: FileStorage.Download.Params): FileStorage.Download.Result {
    const fileStream = this.s3
      .getObject({
        Bucket: this.bucket,
        Key: fileKey,
      })
      .createReadStream();

    return { file: fileStream };
  }

  async delete({
    fileName,
  }: FileStorage.Delete.Params): Promise<FileStorage.Delete.Result> {
    await this.s3
      .deleteObject({ Bucket: this.bucket, Key: fileName })
      .promise();
  }

  private contentType(filename: string): string {
    const extension = filename.split('.').pop();
    const mime = new MimeClass();
    const contentType = mime.toContentType(extension);
    if (!contentType) throw new Error('Unsupported file type');
    return contentType;
  }
}