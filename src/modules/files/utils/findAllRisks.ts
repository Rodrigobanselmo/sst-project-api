import { RiskRepository } from '../../../modules/checklist/repositories/implementations/RiskRepository';
import { IRiskSheet } from '../../../shared/constants/workbooks/sheets/risk/riskSheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';

export const findAllRisks = async (
  excelProvider: ExcelProvider,
  riskRepository: RiskRepository,
  riskSheet: IRiskSheet,
  companyId: string,
) => {
  const riskData = await riskRepository.findAllByCompanyId(companyId, {
    include: { recMed: true, generateSource: true },
    where: { type: riskSheet.type },
  });

  const riskExcelRows = await excelProvider.transformToExcelData(
    riskData,
    riskSheet.columns,
  );

  return {
    sheetName: riskSheet.name,
    rows: riskExcelRows,
    tableHeader: riskSheet.columns,
  };
};
