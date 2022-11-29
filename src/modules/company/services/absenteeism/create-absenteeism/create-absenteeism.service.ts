import { BadRequestException, Injectable } from '@nestjs/common';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateAbsenteeismDto } from '../../../dto/absenteeism.dto';
import { AbsenteeismRepository } from '../../../repositories/implementations/AbsenteeismRepository';

@Injectable()
export class CreateAbsenteeismsService {
  constructor(private readonly absenteeismRepository: AbsenteeismRepository, private readonly dayjs: DayJSProvider) {}

  async execute(UpsertAbsenteeismsDto: CreateAbsenteeismDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const employee = await this.absenteeismRepository.findFirstNude({
      where: { employee: { companyId, id: UpsertAbsenteeismsDto.employeeId } },
      select: { id: true },
    });

    if (!employee?.id) throw new BadRequestException('Funcionario não encontrado');

    const startDate = this.dayjs.dayjs(UpsertAbsenteeismsDto.startDate);
    const endDate = this.dayjs.dayjs(UpsertAbsenteeismsDto.endDate);

    UpsertAbsenteeismsDto.startDate = startDate.toDate();
    UpsertAbsenteeismsDto.endDate = endDate.toDate();

    const timeSpent = startDate.diff(endDate, 'minutes');

    const absenteeism = await this.absenteeismRepository.create({
      ...UpsertAbsenteeismsDto,
      timeSpent,
    });

    return absenteeism;
  }
}
