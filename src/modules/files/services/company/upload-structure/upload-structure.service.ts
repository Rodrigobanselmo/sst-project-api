import { UploadCompanyStructureReportDto } from './../../../dto/risk-structure-report.dto';
import { FileCompanyStructureFactory } from '../../../factories/upload/products/CompanyStructure/FileCompanyStructureFactory';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyEnum } from '@prisma/client';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { HierarchyExcelProvider } from '../../../providers/HierarchyExcelProvider';
import { UploadExcelProvider } from '../../../providers/uploadExcelProvider';
import { findAllEmployees } from '../../../utils/findAllEmployees';
import { ErrorCompanyEnum, ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';
import { ICompanySheet } from '../../../../../shared/constants/workbooks/sheets/company/companySheet.constant';
import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { IExcelReadData } from '../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { asyncEach } from '../../../../../shared/utils/asyncEach';

import { DatabaseTableEntity } from '../../../entities/databaseTable.entity';
import { DatabaseTableRepository } from '../../../repositories/implementations/DatabaseTableRepository';
import { WorkspaceRepository } from '../../../../company/repositories/implementations/WorkspaceRepository';
import { hierarchyList } from '../../../../../shared/constants/lists/hierarchy.list';

@Injectable()
export class UploadCompanyStructureService {
  constructor(private readonly fileCompanyStructureFactory: FileCompanyStructureFactory) {}

  async execute(file: Express.Multer.File, userPayloadDto: UserPayloadDto, body: UploadCompanyStructureReportDto) {
    if (!file) throw new BadRequestException(`file is not available`);
    const buffer = file.buffer;

    const data = await this.fileCompanyStructureFactory.execute(buffer, { companyId: userPayloadDto.targetCompanyId, user: userPayloadDto, ...body });
    return data;
  }
}
