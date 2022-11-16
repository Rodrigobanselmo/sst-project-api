import { UpdateFileExamDto } from './../../../../../dto/employee-exam-history';
import { BadRequestException, Injectable } from '@nestjs/common';

import { EmployeeExamsHistoryEntity } from '../../../../../entities/employee-exam-history.entity';
import { ErrorMessageEnum } from '../../../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
import { v4 } from 'uuid';
import { removeDuplicate } from '../../../../../../../shared/utils/removeDuplicate';

@Injectable()
export class UploadExamFileService {
  constructor(private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository, private readonly amazonStorageProvider: AmazonStorageProvider) {}

  async execute({ ids }: UpdateFileExamDto, user: UserPayloadDto, file: Express.Multer.File) {
    const companyId = user.targetCompanyId;

    const found = await this.employeeExamHistoryRepository.findNude({
      where: {
        id: { in: ids },
        employee: { companyId },
      },
      select: { id: true, fileUrl: true },
    });

    //tenant
    if (found.length != ids.length) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_HISTORY_NOT_FOUND);

    let url: string;

    if (file) {
      url = await this.upload(companyId, file, found);
    }

    const document = await this.employeeExamHistoryRepository.updateMany({
      data: ids.map((id) => ({
        id,
        fileUrl: url,
      })),
    });

    return document;
  }

  private async upload(companyId: string, file: Express.Multer.File, examFound: EmployeeExamsHistoryEntity[]) {
    const fileUrls = removeDuplicate(
      examFound.map((exam) => exam.fileUrl).filter((i) => i),
      { removeById: 'fileUrl' },
    );

    const foundByFileUrl = await this.employeeExamHistoryRepository.findNude({
      where: {
        fileUrl: {
          in: fileUrls,
        },
      },
      select: {
        id: true,
        fileUrl: true,
      },
    });

    try {
      await Promise.all(
        fileUrls.map(async (fileUrl) => {
          const files = foundByFileUrl.filter((fileExam) => fileExam.fileUrl === fileUrl);
          if (files.length === 1) {
            const splitUrl = fileUrl.split('.com/');

            await this.amazonStorageProvider.delete({
              fileName: splitUrl[splitUrl.length - 1],
            });
          }
        }),
      );

      const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
      const path = companyId + '/exams/' + `${v4()}` + '.' + fileType;

      const { url } = await this.amazonStorageProvider.upload({
        file: file.buffer,
        fileName: path,
        // isPublic: true,
      });

      return url;
    } catch (err) {
      console.log('upload exam file', err);
      throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_HISTORY_NOT_FOUND);
    }
  }
}
