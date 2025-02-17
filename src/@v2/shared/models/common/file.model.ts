export type IFileModel = {
  id: string;
  name: string;
  url: string;
  key: string;
  bucket: string;
};

export class FileModel {
  id: string;
  name: string;
  url: string;
  key: string;
  bucket: string;

  constructor(params: IFileModel) {
    this.id = params.id;
    this.name = params.name;
    this.url = params.url;
    this.key = params.key;
    this.bucket = params.bucket;
  }
}
