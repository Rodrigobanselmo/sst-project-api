import { ICreatePGR } from './../../../docx/builders/pgr/types/pgr.types';
import { DocumentBuildPGR } from './../../../docx/builders/pgr/create';
import { IDocumentModelData } from './../../../types/document-mode.types';
import { RiskDocumentEntity } from './../../../../sst/entities/riskDocument.entity';
import { AttachmentEntity } from './../../../../sst/entities/attachment.entity';
import { ISectionOptions } from 'docx';
import { CompanyEntity } from './../../../../company/entities/company.entity';

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

export type IImagesMap = Record<string, { path: string }>

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

export interface IUnlinkPaths { path: string, url: string }

export interface IDocumentFactoryProduct<T = any, R = any> {
  localCreation?: boolean;
  type: string;
  unlinkPaths: IUnlinkPaths[];
  downloadPathImage(url: string): Promise<string>;
  getData(body: T): R;
  getAttachments(data: IGetDocument<T, R>): Promise<IDocumentAttachment[]>;
  getFileName(body: T, type?: string, ...args: any[]): string;
  getVersionName(data: R, body: T): string;
  getDocumentBuild(options: IGetDocument<T, R>): Promise<ICreatePGR>;
  getDocumentSections(options: IGetDocument<T, R>): Promise<ISectionOptions[]>;
  save(options: ISaveDocument<T, R>): Promise<RiskDocumentEntity>;
  error(options: Pick<ISaveDocument<T, R>, 'body'>): Promise<void>;
  documentModelData(id: number, companyId: string): Promise<IDocumentModelData>;
  // getFilename(): string;
  // findTableData(companyId: string, query: T): Promise<IFileFactoryProductFindData>;
  // sanitizeData(...data: any): IFileSanitizeData[];
  // getHeaderIndex(readFileData: IExcelReadData, columnsMap: IColumnRuleMap): number;
  // getSheets(readFileData: IExcelReadData[]): Promise<ISheetData[]>;
  // getColumns(): Promise<IColumnRuleMap>;
  // saveData(data: ISheetExtractedData<R>[], body: T): Promise<any>;
  // getTitle(header: IFileHeader, ...data: any): IFileCell[][];
  // getEndInformation(...data: any): IFileCell[][];
}
