import { ICreatePGR } from "../../../libs/docx/builders/pgr/types/pgr.types";


export interface IGetDocumentFileName {
  name: string;
  typeName: string;
  version: string;
  company: CompanyEntity;
  textType?: string;
}

export interface IDocumentAttachment {
  buildData: ICreatePGR;
  section: ISectionOptions[];
  link: string;
  type: string;
  id: string;
  name: string;
}

export type IImagesMap = Record<string, { path: string }>;

export interface IGetDocument<T, R> {
  version: string;
  attachments: AttachmentEntity[];
  data: R;
  body: T;
}

export interface ISaveDocument<T, R> {
  url: string;
  attachments: AttachmentEntity[];
  data: R;
  body: T;
}

export interface IUnlinkPaths {
  path: string;
  url: string;
}

export interface IDocumentFactoryProduct<T = any, R = any> {
  type: string;
  unlinkPaths: IUnlinkPaths[];
  downloadPathImage(url: string): Promise<string>;
  getData(body: T): R;
  getAttachments(data: IGetDocument<T, R>): Promise<IDocumentAttachment[]>;
  getFileName(body: T, type?: string, ...args: any[]): string;
  getVersionName(data: R, body: T): string;
  getSections(options: IGetDocument<T, R>): Promise<ISectionOptions[]>;
  save(options: ISaveDocument<T, R>): Promise<RiskDocumentEntity>;
  error(options: Pick<ISaveDocument<T, R>, 'body'>): Promise<void>;
  documentModelData(id: number, companyId: string): Promise<IDocumentModelData>;
}
