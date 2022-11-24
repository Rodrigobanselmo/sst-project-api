import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { FindNotificationDto } from '../dto/nofication.dto';
import { NotificationRepository } from '../repositories/implementations/NotificationRepository';
export declare class ListCompanyNotificationService {
    private readonly notificationRepository;
    constructor(notificationRepository: NotificationRepository);
    execute(user: UserPayloadDto, { skip, take, ...query }: FindNotificationDto): Promise<{
        data: import("../entities/notification.entity").NotificationEntity[];
        countUnread: number;
        count: number;
    }>;
}
