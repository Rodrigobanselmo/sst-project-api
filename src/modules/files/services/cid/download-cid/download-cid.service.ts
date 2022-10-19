import { Injectable } from '@nestjs/common';

import { workbooksConstant } from '../../../../../shared/constants/workbooks/workbooks.constant';
import { WorkbooksEnum } from '../../../../../shared/constants/workbooks/workbooks.enum';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CidRepository } from '../../../../company/repositories/implementations/CidRepository';
import { DownloadExcelProvider } from '../../../providers/donwlodExcelProvider';
import { findAllCids } from './../../../utils/findAllCids';

@Injectable()
export class DownloadCidService {
  constructor(
    private readonly excelProvider: ExcelProvider,
    private readonly cidRepository: CidRepository,
    private readonly downloadExcelProvider: DownloadExcelProvider,
  ) {}

  async execute(userPayloadDto: UserPayloadDto) {
    const Workbook = workbooksConstant[WorkbooksEnum.CID];
    const companyId = userPayloadDto.targetCompanyId;

    return this.downloadExcelProvider.newTableData({
      findAll: (sheet) =>
        findAllCids(this.excelProvider, this.cidRepository, sheet),
      Workbook,
      companyId,
    });
  }
}
