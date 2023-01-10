import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ScheduleBlockRepository } from '../../../repositories/implementations/ScheduleBlockRepository';
import { CreateScheduleBlockDto } from './../../../dto/schedule-block';

@Injectable()
export class CreateScheduleBlocksService {
  constructor(private readonly scheduleBlockRepository: ScheduleBlockRepository) {}

  async execute(body: CreateScheduleBlockDto, user: UserPayloadDto) {
    const companyId = user.companyId;

    const scheduleBlock = await this.scheduleBlockRepository.create({
      ...body,
      companyId,
    });

    return scheduleBlock;
  }
}
