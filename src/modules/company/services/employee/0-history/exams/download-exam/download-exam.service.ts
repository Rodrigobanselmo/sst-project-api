import { BadRequestException, Injectable } from '@nestjs/common';

import { ErrorMessageEnum } from '../../../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EmployeeExamsHistoryRepository } from './../../../../../repositories/implementations/EmployeeExamsHistoryRepository';

@Injectable()
export class DownloadExamService {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
  ) {}

  async execute(id: number, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const documentFound = await this.employeeExamHistoryRepository.findFirstNude({
      where: {
        id,
        employee: { companyId },
      },
      select: { id: true, fileUrl: true },
    });

    if (!documentFound?.id) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_HISTORY_NOT_FOUND);

    const fileKey = documentFound.fileUrl.split('.com/').pop();
    const { file: fileStream } = await this.amazonStorageProvider.download({
      fileKey,
    });

    return { fileStream, fileKey };
  }
}
