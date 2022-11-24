import { MessageEnum } from './../../../shared/constants/enum/message.enum';
import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
export declare class MessageNotificationDto {
    message?: string;
    title?: string;
    subtitle?: string;
    type?: MessageEnum;
}
export declare class CreateNotificationDto {
    companiesIds?: string[];
    usersIds?: number[];
    isClinic?: boolean;
    isConsulting?: boolean;
    isCompany?: boolean;
    repeatId?: string;
    json: MessageNotificationDto;
}
declare const UpdateNotificationDto_base: import("@nestjs/common").Type<Partial<CreateNotificationDto>>;
export declare class UpdateNotificationDto extends UpdateNotificationDto_base {
    id: number;
    json?: MessageNotificationDto;
}
export declare class UpdateUserNotificationDto {
    id: number;
    ids: number[];
    userId: number;
}
export declare class FindNotificationDto extends PaginationQueryDto {
    companiesIds?: string[];
    usersIds?: number[];
    isClinic?: boolean;
    isConsulting?: boolean;
    isCompany?: boolean;
    isUnread?: boolean;
}
export {};
