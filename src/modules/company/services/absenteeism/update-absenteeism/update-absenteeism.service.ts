import { EmployeeRepository } from './../../../repositories/implementations/EmployeeRepository';
import { UpdateAbsenteeismDto } from '../../../dto/absenteeism.dto';
import { AbsenteeismRepository } from '../../../repositories/implementations/AbsenteeismRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class UpdateAbsenteeismsService {
  constructor(
    private readonly absenteeismRepository: AbsenteeismRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly dayjs: DayJSProvider,
  ) {}
  async execute(UpsertAbsenteeismsDto: UpdateAbsenteeismDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const employee = await this.employeeRepository.findFirstNude({
      where: { companyId, id: UpsertAbsenteeismsDto.employeeId },
      select: { id: true },
    });

    if (!employee?.id) throw new BadRequestException('Funcionario não encontrado');

    const startDate = this.dayjs.dayjs(UpsertAbsenteeismsDto.startDate);
    const endDate = this.dayjs.dayjs(UpsertAbsenteeismsDto.endDate);

    UpsertAbsenteeismsDto.startDate = startDate.toDate();
    UpsertAbsenteeismsDto.endDate = endDate.toDate();

    const timeSpent = startDate.diff(endDate, 'minutes');

    const absenteeism = await this.absenteeismRepository.update({
      ...UpsertAbsenteeismsDto,
      timeSpent,
    });

    return absenteeism;
  }
}
