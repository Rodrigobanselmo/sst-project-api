import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from 'src/shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from './../../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EmployeeExamsHistoryRepository } from './../../../../../repositories/implementations/EmployeeExamsHistoryRepository';

@Injectable()
export class DeleteEmployeeExamHistoryService {
  constructor(
    private readonly amazonStorageProvider: AmazonStorageProvider,
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
  ) {}

  async execute(id: number, employeeId: number, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    return;
    const found = await this.employeeExamHistoryRepository.findFirstNude({
      where: {
        id,
        employeeId,
        employee: { companyId },
      },
      select: {
        id: true,
        fileUrl: true,
      },
    });

    if (!found?.id)
      throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    if (found?.fileUrl) {
      const foundByFileUrl = await this.employeeExamHistoryRepository.findNude({
        where: {
          fileUrl: found.fileUrl,
        },
        select: {
          id: true,
          fileUrl: true,
        },
      });

      if (foundByFileUrl.length > 1) {
        const splitUrl = found.fileUrl.split('.com/');

        await this.amazonStorageProvider.delete({
          fileName: splitUrl[splitUrl.length - 1],
        });
      }
    }

    const history = await this.employeeExamHistoryRepository.delete(id);

    return history;
  }
}
