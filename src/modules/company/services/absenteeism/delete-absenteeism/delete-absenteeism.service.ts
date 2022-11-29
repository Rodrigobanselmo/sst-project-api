import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AbsenteeismRepository } from '../../../repositories/implementations/AbsenteeismRepository';

@Injectable()
export class DeleteAbsenteeismsService {
  constructor(private readonly absenteeismRepository: AbsenteeismRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const absenteeismFound = await this.absenteeismRepository.findFirstNude({
      where: {
        id,
        employee: {
          companyId: user.targetCompanyId,
        },
      },
    });

    if (!absenteeismFound?.id) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    const absenteeism = await this.absenteeismRepository.delete(id);

    return absenteeism;
  }
}
