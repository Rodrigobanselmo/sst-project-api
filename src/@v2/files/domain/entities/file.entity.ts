type FileEntityConstructor = {
  id?: string;
  companyId: string;
  name: string;
  url: string;
  key: string;
  bucket: string;
  shouldDelete?: boolean;
};

export class FileEntity {
  id: string;
  companyId: string;
  name: string;
  url: string;
  key: string;
  bucket: string;
  shouldDelete: boolean;

  constructor(params: FileEntityConstructor) {
    this.id = params.id || '';
    this.companyId = params.companyId;
    this.name = params.name;
    this.url = params.url;
    this.key = params.key;
    this.bucket = params.bucket;
    this.shouldDelete = params.shouldDelete || false;
  }
}
