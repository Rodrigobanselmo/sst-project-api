import { formatCNPJ } from '@brazilian-utils/brazilian-utils';
import { CompanyRepository } from './../../../../company/repositories/implementations/CompanyRepository';
import { getAddressCity, getAddressMain, getContact } from './../../../../../shared/utils/getAddress';
import { CompanyEntity } from './../../../../company/entities/company.entity';
import { ISheetHeaderList } from '../../upload/types/IFileFactory.types';
import { IReportCell, ReportFillColorEnum } from '../types/IReportFactory.types';

export async function getCompany(companyId: string, companyRepository: CompanyRepository) {
  const company = await companyRepository.findFirstNude({
    where: { id: companyId },
    select: {
      name: true,
      cnpj: true,
      address: true,
      fantasy: true,
      workspace: { select: { id: true, abbreviation: true, name: true } },
      receivingServiceContracts: {
        select: { applyingServiceCompany: { select: { name: true, cnpj: true, address: true, contacts: { where: { isPrincipal: true } } } } },
      },
    },
  });

  return company;
}

export function getCompanyInfo(company: CompanyEntity) {
  const consultant = company.receivingServiceContracts?.[0]?.applyingServiceCompany;
  const name = consultant?.name || company.name;
  const cnpj = formatCNPJ(consultant?.cnpj || company.cnpj);
  const address = getAddressMain(consultant?.address || company.address);
  const addressCity = getAddressCity(consultant?.address || company.address);
  const contact = getContact(consultant?.contacts?.[0]);

  const rows: IReportCell[][] = [
    [
      {
        content: `${name} (${cnpj})`,
        mergeRight: 20,
        fill: ReportFillColorEnum.HEADER_GREEN,
        font: { size: 14, bold: true, color: { theme: 1 }, name: 'Calibri' },
      },
    ],
    [{ content: address, mergeRight: 20, fill: ReportFillColorEnum.HEADER_GREEN, font: { size: 14, bold: true, color: { theme: 1 }, name: 'Calibri' } }],
    [{ content: addressCity, mergeRight: 20, fill: ReportFillColorEnum.HEADER_GREEN, font: { size: 14, bold: true, color: { theme: 1 }, name: 'Calibri' } }],
  ];

  if (contact) rows.push([{ content: contact, mergeRight: 20, fill: ReportFillColorEnum.HEADER_GREEN }]);

  const subRows: IReportCell[][] = [];

  if (consultant)
    subRows.push([{ content: `${company.name} (${company.cnpj})`, mergeRight: 'all', font: { size: 11, bold: true, color: { theme: 1 }, name: 'Calibri' } }]);

  return { main: rows, sub: subRows };
}
