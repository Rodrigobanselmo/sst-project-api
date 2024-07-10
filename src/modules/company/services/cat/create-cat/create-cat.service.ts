import { EmployeeRepository } from './../../../repositories/implementations/EmployeeRepository';
import { ErrorMessageEnum } from './../../../../../shared/constants/enum/errorMessage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateCatDto } from '../../../dto/cat.dto';
import { CatRepository } from '../../../repositories/implementations/CatRepository';

@Injectable()
export class CreateCatsService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly catRepository: CatRepository,
    private readonly dayjs: DayJSProvider,
  ) {}

  async execute(UpsertCatsDto: CreateCatDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const employeeFound = await this.employeeRepository.findFirstNude({
      where: { companyId, id: UpsertCatsDto.employeeId },
      select: { id: true },
    });

    if (!employeeFound?.id) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    const cat = await this.catRepository.create({
      ...UpsertCatsDto,
    });

    return cat;
  }
}
