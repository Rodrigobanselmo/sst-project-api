import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { TpAmbEnum } from '../interfaces/event-batch';
export declare class BaseEventDto {
    tpAmb?: TpAmbEnum;
    procEmi?: number;
    companyId?: string;
}
export declare class Event2220Dto extends BaseEventDto {
}
export declare class Event2240Dto extends BaseEventDto {
}
export declare class FindEvents2220Dto extends PaginationQueryDto {
    search?: string;
    companyId: string;
    all?: boolean;
    companiesIds?: string[];
}
export declare class FindEvents2240Dto extends PaginationQueryDto {
    search?: string;
    companyId: string;
}
