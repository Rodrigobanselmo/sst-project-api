import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { UpdateUserNotificationDto } from '../dto/nofication.dto';
import { NotificationRepository } from '../repositories/implementations/NotificationRepository';
export declare class UpdateUserNotificationService {
    private readonly notificationRepository;
    constructor(notificationRepository: NotificationRepository);
    execute(user: UserPayloadDto, dto: UpdateUserNotificationDto): Promise<import("../entities/notification.entity").NotificationEntity | import("../entities/notification.entity").NotificationEntity[]>;
}
