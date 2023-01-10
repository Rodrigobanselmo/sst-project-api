import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from 'src/shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ScheduleBlockRepository } from '../../../repositories/implementations/ScheduleBlockRepository';

@Injectable()
export class FindOneScheduleBlocksService {
  constructor(private readonly scheduleBlockRepository: ScheduleBlockRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const schedule = await this.scheduleBlockRepository.findFirstNude({
      where: { id },
      include: {
        applyOnCompanies: { where: { status: 'ACTIVE' }, select: { id: true } },
      },
    });

    if (!schedule?.id) throw new BadRequestException(ErrorMessageEnum.SCHEDULE_BLOCK_NOT_FOUND);
    if (schedule?.companyId != user.companyId && schedule?.companyId != user.targetCompanyId) throw new BadRequestException(ErrorMessageEnum.SCHEDULE_BLOCK_ACCESS);

    return schedule;
  }
}
