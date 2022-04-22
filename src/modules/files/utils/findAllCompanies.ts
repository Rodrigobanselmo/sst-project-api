import { CompanyRepository } from '../../../modules/company/repositories/implementations/CompanyRepository';
import { ICompanySheet } from '../../../shared/constants/workbooks/sheets/company/companySheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';

export const findAllCompanies = async (
  excelProvider: ExcelProvider,
  companyRepository: CompanyRepository,
  riskSheet: ICompanySheet,
  companyId: string,
  isMaster: boolean,
) => {
  let data = [];

  if (!isMaster)
    data = await companyRepository.findAllRelatedByCompanyId(companyId, {
      include: { primary_activity: true, secondary_activity: true },
    });

  if (isMaster)
    data = await companyRepository.findAll({
      include: { primary_activity: true, secondary_activity: true },
    });

  const excelRows = await excelProvider.transformToExcelData(
    data,
    riskSheet.columns,
  );

  return {
    sheetName: riskSheet.name,
    rows: excelRows,
    tableHeader: riskSheet.columns,
  };
};
