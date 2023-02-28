import { UploadDocumentDto } from '../../../../../dto/document.dto';
import { CompanyEntity } from './../../../../../../company/entities/company.entity';

export interface IGetDocumentFileName {
  name: string;
  typeName: string;
  version: string;
  company: CompanyEntity;
  textType?: string;
}

export type IDocumentPGRBody = UploadDocumentDto;
