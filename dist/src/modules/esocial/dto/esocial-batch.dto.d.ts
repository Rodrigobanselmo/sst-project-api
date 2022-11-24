import { EmployeeESocialEventActionEnum, EmployeeESocialEventTypeEnum, StatusEnum } from '@prisma/client';
import { IESocial2240, IESocial2220, IESocial3000 } from './../../../shared/providers/ESocialProvider/models/IESocialMethodProvider';
import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
export declare class CreateESocialEvent {
    eventsDate?: Date;
    eventXml: string;
    employeeId: number;
    eventId: string;
    examHistoryId?: number;
    pppHistoryId?: number;
    action?: EmployeeESocialEventActionEnum;
}
export declare class CreateESocialBatch {
    environment: number;
    status: StatusEnum;
    userTransmissionId: number;
    companyId: string;
    response?: any;
    events?: CreateESocialEvent[];
    examsIds?: number[];
    pppJson?: {
        json: any;
        event: IESocial3000.XmlReturn | IESocial2220.XmlReturn | IESocial2240.XmlReturn;
    }[];
    type: EmployeeESocialEventTypeEnum;
    protocolId?: string;
}
export declare class FindESocialBatchDto extends PaginationQueryDto {
    search: string;
    companyId: string;
    status?: StatusEnum[];
}
