import { IRiskSheet } from '../../../shared/constants/workbooks/sheets/risk/riskSheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { EpiRepository } from '../../sst/repositories/implementations/EpiRepository';

export const findAllEpis = async (excelProvider: ExcelProvider, epiRepository: EpiRepository, riskSheet: IRiskSheet) => {
  const data = await epiRepository.findAll();

  const epiExcelRows = await excelProvider.transformToExcelData(data, riskSheet.columns);

  return {
    sheetName: riskSheet.name,
    rows: epiExcelRows,
    tableHeader: riskSheet.columns,
  };
};
