import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { CreateNotificationDto } from '../dto/nofication.dto';
import { NotificationRepository } from '../repositories/implementations/NotificationRepository';

@Injectable()
export class CreateNotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(user: UserPayloadDto, dto: CreateNotificationDto) {
    const notification = await this.notificationRepository.create({
      ...dto,
      system: user.isSystem,
      companyId: user.companyId,
    });

    return notification;
  }
}
