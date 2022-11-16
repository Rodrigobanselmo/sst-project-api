import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { UpdateUserNotificationDto } from '../dto/nofication.dto';
import { NotificationRepository } from '../repositories/implementations/NotificationRepository';

@Injectable()
export class UpdateUserNotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(user: UserPayloadDto, dto: UpdateUserNotificationDto) {
    if (dto.id) {
      const notification = await this.notificationRepository.confirm({
        ...dto,
        userId: user.userId,
      });
      return notification;
    }

    if (dto.ids) {
      const notification = await this.notificationRepository.confirmMany({
        ...dto,
        userId: user.userId,
      });
      return notification;
    }
  }
}
