export type IFileModel = {
  name: string;
  url: string;
  key: string;
  bucket: string;
};

export class FileModel {
  name: string;
  url: string;
  key: string;
  bucket: string;

  constructor(params: IFileModel) {
    this.name = params.name;
    this.url = params.url;
    this.key = params.key;
    this.bucket = params.bucket;
  }
}
