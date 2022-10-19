import { IRiskSheet } from '../../../shared/constants/workbooks/sheets/risk/riskSheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CidRepository } from './../../company/repositories/implementations/CidRepository';

export const findAllCids = async (
  excelProvider: ExcelProvider,
  cidRepository: CidRepository,
  riskSheet: IRiskSheet,
) => {
  const data = await cidRepository.findNude();
  const cidExcelRows = await excelProvider.transformToExcelData(
    data,
    riskSheet.columns,
  );

  return {
    sheetName: riskSheet.name,
    rows: cidExcelRows,
    tableHeader: riskSheet.columns,
  };
};
