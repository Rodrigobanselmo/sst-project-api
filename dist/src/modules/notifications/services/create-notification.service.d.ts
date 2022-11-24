import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { CreateNotificationDto } from '../dto/nofication.dto';
import { NotificationRepository } from '../repositories/implementations/NotificationRepository';
export declare class CreateNotificationService {
    private readonly notificationRepository;
    constructor(notificationRepository: NotificationRepository);
    execute(user: UserPayloadDto, dto: CreateNotificationDto): Promise<import("../entities/notification.entity").NotificationEntity>;
}
