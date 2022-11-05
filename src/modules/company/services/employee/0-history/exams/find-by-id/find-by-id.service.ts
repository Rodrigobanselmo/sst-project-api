import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from 'src/shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';

@Injectable()
export class FindByIdEmployeeExamHistoryService {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
  ) {}

  async execute(id: number, user: UserPayloadDto) {
    const found = await this.employeeExamHistoryRepository.findFirstNude({
      where: { id, employee: { companyId: user.targetCompanyId } },
      include: {
        clinic: { select: { id: true, fantasy: true, address: true } },
        doctor: {
          select: {
            councilId: true,
            councilType: true,
            councilUF: true,
            professional: {
              select: {
                cpf: true,
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (!found?.id)
      throw new BadRequestException(ErrorMessageEnum.FORBIDDEN_ACCESS);

    return found;
  }
}
