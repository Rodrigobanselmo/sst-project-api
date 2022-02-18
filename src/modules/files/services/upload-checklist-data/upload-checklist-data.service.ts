import { BadRequestException, Injectable } from '@nestjs/common';
import { ExcelProvider } from 'src/shared/providers/ExcelProvider/implementations/ExcelProvider';
import { IExcelReadData } from 'src/shared/providers/ExcelProvider/models/IExcelProvider.types';
import { commonRiskTableConstant } from '../../constants/commonRiskTable.constant';

const readPhysicalRisks = (
  readFileData: IExcelReadData[],
  excelProvider: ExcelProvider,
) => {
  const physicalRisksTable = readFileData.find(
    (data) => data.name === 'Riscos físicos',
  );

  return excelProvider.transformToTableData(
    physicalRisksTable,
    commonRiskTableConstant,
  );
};

@Injectable()
export class UploadChecklistDataService {
  constructor(private readonly excelProvider: ExcelProvider) {}

  async execute(file: Express.Multer.File) {
    if (!file) throw new BadRequestException(`file is not available`);
    const buffer = file.buffer;

    const readFileData = await this.excelProvider.read(buffer);
    return readPhysicalRisks(readFileData, this.excelProvider);
  }
}
