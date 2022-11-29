import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CatRepository } from '../../../repositories/implementations/CatRepository';

@Injectable()
export class DeleteCatsService {
  constructor(private readonly catRepository: CatRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const catFound = await this.catRepository.findFirstNude({
      where: {
        id,
        employee: {
          companyId: user.targetCompanyId,
        },
      },
    });

    if (!catFound?.id) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    const cat = await this.catRepository.delete(id);

    return cat;
  }
}
