import { TpAmbEnum } from './../../../../modules/esocial/interfaces/event-batch';
import { EmployeeEntity } from './../../../../modules/company/entities/employee.entity';
import { IEvent2220Props } from './../../../../modules/esocial/interfaces/event-2220';
import { CompanyEntity } from '../../../../modules/company/entities/company.entity';
import { CompanyCertEntity } from '../../../../modules/esocial/entities/companyCert.entity';
export interface IConvertPfx {
  file: Express.Multer.File;
  password: string;
}

export interface ICreateZipFolder {
  company: CompanyEntity;
  eventsXml: { id: string; xml: string }[];
  type: '2220' | '2240' | '2210';
}

export interface IConvertPfxReturn {
  certificate: string;
  key: string;
  notAfter: Date;
  notBefore: Date;
}

export interface ISignEvent {
  cert: CompanyCertEntity;
  xml: string;
  path: string;
}

interface IIdOptions {
  type?: number;
  seqNum?: number;
  index?: number;
}
export interface IESocialStruck2220 {
  event: IEvent2220Props;
  employee: EmployeeEntity;
  asoId: number;
  examIds: number[];
  eventDate: Date;
  id: string;
}

export interface IESocialXmlStruck2220
  extends Omit<IESocialStruck2220, 'event'> {
  signedXml: string;
  xml: string;
}

export interface IESocialSendEventOptions {
  environment: TpAmbEnum;
  company: CompanyEntity;
}

export interface ICompanyOptions {
  cert?: boolean;
  report?: boolean;
}
interface IESocialMethodProvider {
  convertPfxToPem(data: IConvertPfx): Promise<IConvertPfxReturn>;
  generateId(cpfCnpj: string, options?: IIdOptions): void;
}

export { IESocialMethodProvider as IESocialEventProvider, IIdOptions };
