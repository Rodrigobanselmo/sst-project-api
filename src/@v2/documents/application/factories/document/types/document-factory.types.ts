import { AttachmentEntity } from "@/@v2/documents/domain/entities/attachment.entity";
import { AttachmentModel } from "@/@v2/documents/domain/models/attachment.model";
import { ISectionOptions } from 'docx';


export interface IDocumentAttachment {
  section: ISectionOptions[];
  type: string;
  id: string;
  name: string;
}

export interface IGetAttachments<T, R> {
  version: string;
  data: R;
  body: T;
}

export interface IGetDocument<T, R> {
  version: string;
  attachments: AttachmentModel[];
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
}

export interface IDocumentFactoryProduct<T = any, R = any> {
  type: string;
  unlinkPaths: IUnlinkPaths[];
  downloadPathImage(url: string): Promise<string>;
  getData(body: T): R;
  getAttachments(data: IGetAttachments<T, R>): Promise<IDocumentAttachment[]>;
  getFileName(body: R, type?: string, ...args: any[]): string;
  getVersionName(data: R, body: T): string;
  getSections(options: IGetDocument<T, R>): Promise<ISectionOptions[]>;
  save(options: ISaveDocument<T, R>): Promise<RiskDocumentEntity>;
  error(options: Pick<ISaveDocument<T, R>, 'body'>): Promise<void>;
}
