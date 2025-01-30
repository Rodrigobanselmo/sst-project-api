import { AttachmentEntity } from '@/@v2/documents/domain/entities/attachment.entity';
import { DocumentVersionEntity } from '@/@v2/documents/domain/entities/document-version.entity';
import { AttachmentModel } from '@/@v2/documents/domain/models/attachment.model';
import { ISectionOptions } from 'docx';

export interface IDocumentAttachment {
  id: string;
  section: ISectionOptions[];
  model: AttachmentModel;
}

export interface IGetAttachments<T, R> {
  data: R;
  body: T;
}

export interface IGetDocument<T, R> {
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

export interface ISaveErrorDocument<T> {
  body: T;
}

export interface IUnlinkPaths {
  path: string;
}

export interface IDocumentFactoryProduct<T = any, R = any> {
  type: string;
  unlinkPaths: IUnlinkPaths[];
  getData(body: T): Promise<R>;
  getAttachments(data: IGetAttachments<T, R>): Promise<IDocumentAttachment[]>;
  getFileName(data: R, type?: string, ...args: any[]): string;
  getSections(options: IGetDocument<T, R>): Promise<ISectionOptions[]>;
  save(options: ISaveDocument<T, R>): Promise<DocumentVersionEntity>;
  error(options: ISaveErrorDocument<T>): Promise<void>;
}
