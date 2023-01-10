import { FindScheduleBlockDto } from './../../../dto/schedule-block';
import { ScheduleBlockRepository } from '../../../repositories/implementations/ScheduleBlockRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindScheduleBlocksService {
  constructor(private readonly scheduleBlockRepository: ScheduleBlockRepository) {}

  async execute({ skip, take, ...query }: FindScheduleBlockDto, user: UserPayloadDto) {
    const cats = await this.scheduleBlockRepository.find({ companyId: user.targetCompanyId, ...query }, { skip, take });

    return cats;
  }
}
