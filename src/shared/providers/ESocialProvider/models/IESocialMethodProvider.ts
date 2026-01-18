import { CatEntity } from './../../../../modules/company/entities/cat.entity';
import {
  IBreakPointPPP,
  IEmployee2240Data,
  IEvent2240Props,
} from './../../../../modules/esocial/interfaces/event-2240';
import { IEsocialSendBatchResponse } from './../../../../modules/esocial/interfaces/esocial';
import { UserPayloadDto } from './../../../dto/user-payload.dto';
import { BaseEventDto } from './../../../../modules/esocial/dto/event.dto';
import { EmployeeExamsHistoryEntity } from './../../../../modules/company/entities/employee-exam-history.entity';
import { TpAmbEnum } from './../../../../modules/esocial/interfaces/event-batch';
import { EmployeeEntity } from './../../../../modules/company/entities/employee.entity';
import { IEvent2220Props } from './../../../../modules/esocial/interfaces/event-2220';
import { CompanyEntity } from '../../../../modules/company/entities/company.entity';
import { CompanyCertEntity } from '../../../../modules/esocial/entities/companyCert.entity';
import { IEvent3000Props } from '../../../../modules/esocial/interfaces/event-3000';
import { EmployeeESocialEventTypeEnum, Prisma } from '@prisma/client';
import { EmployeePPPHistoryEntity } from './../../../../modules/company/entities/employee-ppp-history.entity';
import { IEvent2210Props } from './../../../../modules/esocial/interfaces/event-2210';
export interface IConvertPfx {
  file: any;
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
}

interface IIdOptions {
  type?: number;
  seqNum?: number;
  index?: number;
  timeLess?: number;
  shortCNPJ?: boolean;
}

export declare namespace IESocial2210 {
  export interface StructureReturn {
    event: IEvent2210Props;
    employee: EmployeeEntity;
    cat: CatEntity;
    eventDate: Date;
    id: string;
    idFull?: string;
  }

  export interface XmlReturn extends Omit<StructureReturn, 'event'> {
    signedXml: string;
    xml: string;
  }
}

export declare namespace IESocial2220 {
  export interface StructureReturn {
    event: IEvent2220Props;
    employee: EmployeeEntity;
    asoId: number;
    aso: EmployeeExamsHistoryEntity;
    historyExams: EmployeeExamsHistoryEntity[];
    examIds: number[];
    eventDate: Date;
    id: string;
    idFull?: string;
  }

  export interface XmlReturn extends Omit<StructureReturn, 'event'> {
    signedXml: string;
    xml: string;
  }
}

export declare namespace IESocial2240 {
  export interface StructureEntry {
    company: CompanyEntity;
    esocialStartDate: Date;
    employees: IEmployee2240Data[];
  }

  export interface StructureReturn {
    event: IEvent2240Props;
    employee: EmployeeEntity;
    eventDate: Date;
    id: string;
    receipt?: string;
    isSame?: boolean;
    isExclude?: boolean;
    ppp?: EmployeePPPHistoryEntity;
    json?: any;
    idFull?: string;
  }

  export interface XmlReturn extends Omit<StructureReturn, 'event'> {
    signedXml: string;
    xml: string;
  }
}

export declare namespace IESocial3000 {
  export interface Event {
    receipt: string;
    cpf: string;
    eventType: EmployeeESocialEventTypeEnum;
    employee: EmployeeEntity;

    ppp?: EmployeePPPHistoryEntity;
    aso?: EmployeeExamsHistoryEntity;
  }

  export interface StructureEntry {
    cnpj: string;
    event: Event[];
  }

  export interface StructureReturn extends Event {
    id: string;
    idFull?: string;
    event: IEvent3000Props;
  }

  export interface XmlReturn extends Omit<StructureReturn, 'event'> {
    signedXml: string;
    xml: string;
  }

  export interface SendEntry {
    company: CompanyEntity;
    cert: CompanyCertEntity;
    events: Event[];
    esocialSend?: boolean;
    body: BaseEventDto;
    user: UserPayloadDto;
    type: EmployeeESocialEventTypeEnum;
  }
}

export interface IBatchDatabaseSave {
  company: CompanyEntity;
  body: BaseEventDto;
  user: UserPayloadDto;
  type: EmployeeESocialEventTypeEnum;
  sendEvents: {
    events: (IESocial3000.XmlReturn | IESocial2220.XmlReturn | IESocial2240.XmlReturn)[];
    response: IEsocialSendBatchResponse;
  }[];

  esocialSend?: boolean;
}

export interface IESocialSendEventOptions {
  environment: TpAmbEnum;
  company: CompanyEntity;
}

export interface IESocialFetchEventOptions {
  environment: TpAmbEnum;
}

export interface ICompanyOptions extends Prisma.CompanyFindFirstArgs {
  cert?: boolean;
  doctor?: boolean;
  report?: boolean;
}

interface IESocialMethodProvider {
  convertPfxToPem(data: IConvertPfx): Promise<IConvertPfxReturn>;
  generateId(cpfCnpj: string, options?: IIdOptions): void;
}

export { IESocialMethodProvider as IESocialEventProvider, IIdOptions };
