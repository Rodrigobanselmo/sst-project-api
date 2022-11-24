/// <reference types="multer" />
import { UserPayloadDto } from './../../../shared/dto/user-payload.dto';
import { SendEmailService } from '../services/send-email.service';
import { EmailDto } from '../dto/email.dto';
import { CreateNotificationDto, FindNotificationDto, UpdateUserNotificationDto } from '../dto/nofication.dto';
import { ListNotificationService } from '../services/list-notification.service';
import { CreateNotificationService } from '../services/create-notification.service';
import { ListCompanyNotificationService } from '../services/list-company-notification.service';
import { UpdateUserNotificationService } from '../services/update-user-notification.service';
export declare class NotificationController {
    private readonly sendEmailService;
    private readonly listNotificationService;
    private readonly createNotificationService;
    private readonly listCompanyNotificationService;
    private readonly updateUserNotificationService;
    constructor(sendEmailService: SendEmailService, listNotificationService: ListNotificationService, createNotificationService: CreateNotificationService, listCompanyNotificationService: ListCompanyNotificationService, updateUserNotificationService: UpdateUserNotificationService);
    sendNotification(user: UserPayloadDto, dto: CreateNotificationDto): Promise<import("../entities/notification.entity").NotificationEntity>;
    sendEmail(user: UserPayloadDto, dto: EmailDto, files?: Array<Express.Multer.File>): Promise<void>;
    updateUser(user: UserPayloadDto, dto: UpdateUserNotificationDto, id: number): Promise<import("../entities/notification.entity").NotificationEntity | import("../entities/notification.entity").NotificationEntity[]>;
    listNotification(user: UserPayloadDto, query: FindNotificationDto): Promise<{
        data: import("../entities/notification.entity").NotificationEntity[];
        countUnread: number;
        count: number;
    }>;
    listCompanyNotification(user: UserPayloadDto, query: FindNotificationDto): Promise<{
        data: import("../entities/notification.entity").NotificationEntity[];
        countUnread: number;
        count: number;
    }>;
}
