import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AlertRepository } from '../../../repositories/implementations/AlertRepository';

@Injectable()
export class DeleteAlertService {
  constructor(private readonly alertRepository: AlertRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const contact = await this.alertRepository.delete(id, user.targetCompanyId);

    return contact;
  }
}
