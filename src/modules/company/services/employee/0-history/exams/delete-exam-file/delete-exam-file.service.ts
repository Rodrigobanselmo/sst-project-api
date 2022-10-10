import { BadRequestException, Injectable } from '@nestjs/common';

import { ErrorMessageEnum } from '../../../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EmployeeExamsHistoryRepository } from './../../../../../repositories/implementations/EmployeeExamsHistoryRepository';

@Injectable()
export class DeleteExamFileService {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(id: number, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const found = await this.employeeExamHistoryRepository.findFirstNude({
      where: {
        id,
        employee: { companyId },
      },
      select: {
        id: true,
        fileUrl: true,
      },
    });

    if (!found?.id)
      throw new BadRequestException(
        ErrorMessageEnum.EMPLOYEE_HISTORY_NOT_FOUND,
      );

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

    const document = await this.employeeExamHistoryRepository.update({
      id,
      fileUrl: null,
    });

    return document;
  }
}
