import { Client } from 'nestjs-soap';
import { IEvent3000Props } from '../../../../modules/esocial/interfaces/event-3000';
import { EmployeeEntity } from '../../../../modules/company/entities/employee.entity';
import { IEvent2220Props } from '../../../../modules/esocial/interfaces/event-2220';
import { IEventProps } from '../../../../modules/esocial/interfaces/event-batch';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DayJSProvider } from '../../DateProvider/implementations/DayJSProvider';
import { IBatchDatabaseSave, IESocial2220, IESocial2240, IESocial3000, IESocialSendEventOptions } from '../models/IESocialMethodProvider';
import { CompanyEntity } from './../../../../modules/company/entities/company.entity';
import { EmployeeESocialBatchEntity } from './../../../../modules/esocial/entities/employeeEsocialBatch.entity';
import { IEsocialFetchBatch, IEsocialSendBatchResponse } from './../../../../modules/esocial/interfaces/esocial';
import { ESocialBatchRepository } from './../../../../modules/esocial/repositories/implementations/ESocialBatchRepository';
import { ESocialMethodsProvider } from './ESocialMethodsProvider';
import { IEvent2240Props } from './../../../../modules/esocial/interfaces/event-2240';
declare class ESocialEventProvider {
    private readonly clientProduction;
    private readonly clientRestrict;
    private readonly clientConsultProduction;
    private readonly clientConsultRestrict;
    private readonly prisma;
    private readonly eSocialBatchRepository;
    private readonly dayJSProvider;
    private readonly eSocialMethodsProvider;
    private verProc;
    private indRetif;
    private tpAmb;
    private procEmi;
    private tpInsc;
    private eventGroup;
    constructor(clientProduction: Client, clientRestrict: Client, clientConsultProduction: Client, clientConsultRestrict: Client, prisma: PrismaService, eSocialBatchRepository: ESocialBatchRepository, dayJSProvider: DayJSProvider, eSocialMethodsProvider: ESocialMethodsProvider);
    errorsEvent2220(event: IEvent2220Props): {
        message: string;
    }[];
    errorsEvent2240(event: IEvent2240Props): {
        message: string;
    }[];
    errorsEvent3000(event: IEvent3000Props): {
        message: string;
    }[];
    convertDate(date: Date): string;
    convertToEvent2220Struct(company: CompanyEntity, employees: EmployeeEntity[], options?: {
        ideEvento?: IEventProps['ideEvento'];
    }): IESocial2220.StructureReturn[];
    convertToEvent2240Struct(props: IESocial2240.StructureEntry, options?: {
        ideEvento?: IEventProps['ideEvento'];
    }): IESocial2240.StructureReturn[];
    convertToEvent3000Struct(props: IESocial3000.StructureEntry, options?: {
        ideEvento?: IEventProps['ideEvento'];
    }): IESocial3000.StructureReturn[];
    generateXmlEvent2220(event: IEvent2220Props, options?: {
        declarations?: boolean;
    }): string;
    generateXmlEvent2240(event: IEvent2240Props, options?: {
        declarations?: boolean;
    }): string;
    generateXmlEvent3000(event: IEvent3000Props, options?: {
        declarations?: boolean;
    }): string;
    private generateEventBase;
    private generateBatchXML;
    private generateFetchBatchXML;
    private onGetDate;
    sendEventToESocial(events: (IESocial2220.XmlReturn | IESocial3000.XmlReturn | IESocial2240.XmlReturn)[], options: IESocialSendEventOptions): Promise<{
        events: (IESocial2220.XmlReturn | IESocial2240.XmlReturn | IESocial3000.XmlReturn)[];
        response: IEsocialSendBatchResponse;
    }[]>;
    sendExclusionToESocial(props: IESocial3000.SendEntry): Promise<IESocial3000.XmlReturn[]>;
    saveDatabaseBatchEvent(props: IBatchDatabaseSave): Promise<void>;
    fetchEventToESocial(batch: EmployeeESocialBatchEntity): Promise<{
        batch: EmployeeESocialBatchEntity;
        response: IEsocialFetchBatch.Response;
    }>;
}
export { ESocialEventProvider };
