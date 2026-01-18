import { BadRequestException, Injectable } from '@nestjs/common';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FileCompanyStructureFactory } from '../../../factories/upload/products/CompanyStructure/FileCompanyStructureFactory';
import { CheckEmployeeExamService } from './../../../../sst/services/exam/check-employee-exam/check-employee-exam.service';
import { UploadCompanyStructureReportDto } from './../../../dto/risk-structure-report.dto';

@Injectable()
export class UploadCompanyStructureService {
  constructor(
    private readonly fileCompanyStructureFactory: FileCompanyStructureFactory,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) {}

  async execute(file: any, userPayloadDto: UserPayloadDto, body: UploadCompanyStructureReportDto) {
    if (!file) throw new BadRequestException(`file is not available`);
    const buffer = file.buffer;

    const data = await this.fileCompanyStructureFactory.execute(buffer, {
      companyId: userPayloadDto.targetCompanyId,
      user: userPayloadDto,
      ...body,
    });

    this.checkEmployeeExamService.execute({
      companyId: userPayloadDto.targetCompanyId,
    });

    return data;
  }
}
