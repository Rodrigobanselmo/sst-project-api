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

  if (!isMaster) {
    const response = await companyRepository.findAllRelatedByCompanyId(
      companyId,
      {},
      { take: 100000 },
      {
        include: {
          primary_activity: true,
          secondary_activity: true,
          workspace: { include: { address: true } },
          group: true,
          doctorResponsible: { include: { professional: true } },
          tecResponsible: { include: { professional: true } },
          address: true,
          contacts: { where: { isPrincipal: true } },
        },
      },
    );
    data = response.data;
  }

  if (isMaster) {
    const response = await companyRepository.findAll(
      {},
      { take: 100000 },
      {
        include: { primary_activity: true, secondary_activity: true },
      },
    );

    data = response.data;
  }

  const excelRows = await excelProvider.transformToExcelData(data, riskSheet.columns);

  return {
    sheetName: riskSheet.name,
    rows: excelRows,
    tableHeader: riskSheet.columns,
  };
};
