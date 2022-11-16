import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { FindNotificationDto } from '../dto/nofication.dto';
import { NotificationRepository } from '../repositories/implementations/NotificationRepository';

@Injectable()
export class ListCompanyNotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(user: UserPayloadDto, { skip, take, ...query }: FindNotificationDto) {
    const notification = await this.notificationRepository.find(
      { ...query, userId: user.userId },
      { skip, take },
      {
        where: {
          companyId: user.companyId,
        },
        select: {
          id: true,
          json: true,
          confirmations: { where: { id: user.userId } },
        },
      },
    );

    return notification;
  }
}
