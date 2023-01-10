import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ScheduleBlockRepository } from '../../../repositories/implementations/ScheduleBlockRepository';

@Injectable()
export class DeleteScheduleBlocksService {
  constructor(private readonly scheduleBlockRepository: ScheduleBlockRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const schedule = await this.scheduleBlockRepository.findFirstNude({
      where: { id },
      select: { id: true, companyId: true },
    });

    if (!schedule?.id) throw new BadRequestException(ErrorMessageEnum.SCHEDULE_BLOCK_NOT_FOUND);
    if (schedule?.companyId != user.companyId && schedule?.companyId != user.targetCompanyId) throw new BadRequestException(ErrorMessageEnum.SCHEDULE_BLOCK_ACCESS);

    const cat = await this.scheduleBlockRepository.delete(id);

    return cat;
  }
}
