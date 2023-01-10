import { UpdateScheduleBlockDto } from './../../../dto/schedule-block';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ScheduleBlockRepository } from '../../../repositories/implementations/ScheduleBlockRepository';

@Injectable()
export class UpdateScheduleBlocksService {
  constructor(private readonly scheduleBlockRepository: ScheduleBlockRepository) {}

  async execute(body: UpdateScheduleBlockDto, user: UserPayloadDto) {
    const companyId = user.companyId;

    const cat = await this.scheduleBlockRepository.update({
      ...body,
      companyId,
    });

    return cat;
  }
}
