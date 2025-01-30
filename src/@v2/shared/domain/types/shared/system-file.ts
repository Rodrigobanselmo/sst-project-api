export type ISystemFile = {
  id: string;
  companyId: string;
  name: string;
  url: string;
  key: string;
  bucket: string;
};

export class SystemFile {
  id: string;
  companyId: string;
  name: string;
  url: string;
  key: string;
  bucket: string;

  constructor(params: ISystemFile) {
    this.id = params.id;
    this.companyId = params.companyId;
    this.name = params.name;
    this.url = params.url;
    this.key = params.key;
    this.bucket = params.bucket;
  }
}
