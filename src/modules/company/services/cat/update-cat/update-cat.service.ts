import { ErrorMessageEnum } from './../../../../../shared/constants/enum/errorMessage';
import { UpdateCatDto } from '../../../dto/cat.dto';
import { CatRepository } from '../../../repositories/implementations/CatRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class UpdateCatsService {
  constructor(private readonly catRepository: CatRepository, private readonly dayjs: DayJSProvider) {}

  async execute(UpsertCatsDto: UpdateCatDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const catFound = await this.catRepository.findFirstNude({
      where: { employee: { companyId, id: UpsertCatsDto.employeeId } },
      select: { id: true },
    });

    if (!catFound?.id) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    const cat = await this.catRepository.update({
      ...UpsertCatsDto,
    });

    return cat;
  }
}
