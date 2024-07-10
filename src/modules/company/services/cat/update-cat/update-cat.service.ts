import { EmployeeRepository } from './../../../repositories/implementations/EmployeeRepository';
import { ErrorMessageEnum } from './../../../../../shared/constants/enum/errorMessage';
import { UpdateCatDto } from '../../../dto/cat.dto';
import { CatRepository } from '../../../repositories/implementations/CatRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class UpdateCatsService {
  constructor(
    private readonly catRepository: CatRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly dayjs: DayJSProvider,
  ) {}

  async execute(UpsertCatsDto: UpdateCatDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const employeeFound = await this.employeeRepository.findFirstNude({
      where: { companyId, id: UpsertCatsDto.employeeId },
      select: { id: true },
    });

    if (!employeeFound?.id) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    const cat = await this.catRepository.update({
      ...UpsertCatsDto,
    });

    return cat;
  }
}
