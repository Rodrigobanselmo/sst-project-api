import { ActivityRepository } from './../../company/repositories/implementations/ActivityRepository';
import { IRiskSheet } from '../../../shared/constants/workbooks/sheets/risk/riskSheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';

export const findAllCnaes = async (excelProvider: ExcelProvider, activityRepository: ActivityRepository, riskSheet: IRiskSheet) => {
  const data = await activityRepository.findAll();
  const cnaeExcelRows = await excelProvider.transformToExcelData(data, riskSheet.columns);

  return {
    sheetName: riskSheet.name,
    rows: cnaeExcelRows,
    tableHeader: riskSheet.columns,
  };
};
