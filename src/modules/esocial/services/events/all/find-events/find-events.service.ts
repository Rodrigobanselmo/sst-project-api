import { ESocialEventRepository } from '../../../../repositories/implementations/ESocialEventRepository';
import { FindESocialEventDto } from '../../../../dto/esocial-event.dto';
import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindESocialEventService {
  constructor(private readonly eSocialEventRepository: ESocialEventRepository) {}

  async execute({ skip, take, ...query }: FindESocialEventDto, user: UserPayloadDto) {
    const employees = await this.eSocialEventRepository.find(
      { ...query, companyId: user.targetCompanyId },
      { skip, take },
    );

    return employees;
  }
}
