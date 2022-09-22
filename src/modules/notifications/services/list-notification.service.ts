import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { FindNotificationDto } from '../dto/nofication.dto';
import { NotificationRepository } from '../repositories/implementations/NotificationRepository';

@Injectable()
export class ListNotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(
    user: UserPayloadDto,
    { skip, take, ...query }: FindNotificationDto,
  ) {
    const notification = await this.notificationRepository.find(
      { ...query, userId: user.userId },
      { skip, take },
      {
        select: {
          id: true,
          created_at: true,
          json: true,
          confirmations: { where: { id: user.userId } },
        },
        where: {
          OR: [
            { system: true },
            {
              company: {
                receivingServiceContracts: {
                  some: { applyingServiceCompanyId: user.companyId },
                },
              },
            },
            {
              companies: {
                some: { id: user.companyId },
              },
            },
            {
              users: {
                some: { id: user.userId },
              },
            },
          ],
        },
      },
    );

    return notification;
  }
}
