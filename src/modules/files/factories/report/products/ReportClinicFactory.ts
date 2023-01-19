import { PaginationQueryDto } from './../../../../../shared/dto/pagination.dto';
import { formatCEP } from '@brazilian-utils/brazilian-utils';
import { Injectable } from '@nestjs/common';

import { clinicScheduleMap, companyPaymentScheduleMap } from '../../../../../shared/constants/maps/enumTraslate.map';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { formatPhoneNumber } from '../../../../../shared/utils/formats';
import { CompanyEntity } from '../../../../company/entities/company.entity';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { ReportFactoryAbstractionCreator } from '../creator/ReportFactoryCreator';
import { IReportCell, IReportFactoryProduct, IReportFactoryProductFindData, IReportHeader, IReportSanitizeData } from '../types/IReportFactory.types';
import { FindCompaniesDto } from '../../../../company/dto/company.dto';

@Injectable()
export class ReportClinicFactory extends ReportFactoryAbstractionCreator<FindCompaniesDto> {
  constructor(private readonly companyRepository: CompanyRepository, private readonly excelProv: ExcelProvider) {
    super(excelProv);
  }

  public factoryMethod(): IReportFactoryProduct<FindCompaniesDto> {
    return new ReportFactoryProduct(this.companyRepository);
  }
}

class ReportFactoryProduct implements IReportFactoryProduct<FindCompaniesDto> {
  constructor(private readonly companyRepository: CompanyRepository) {}

  public async findTableData(companyId: string, { skip, take, ...query }: FindCompaniesDto) {
    query.isClinic = true;
    const clinics = await this.companyRepository.findAllRelatedByCompanyId(
      companyId,
      query,
      { take: take || 10_000, skip: skip || 0 },
      {
        orderBy: { fantasy: 'asc' },
        select: {
          unit: true,
          address: true,
          fantasy: true,
          paymentDay: true,
          paymentType: true,
          contacts: { select: { email: true, phone: true, phone_1: true }, where: { isPrincipal: true } },
          clinicExams: {
            take: 1,
            where: { status: 'ACTIVE', scheduleType: { not: null } },
            select: { scheduleType: true },
            orderBy: { endDate: { nulls: 'first', sort: 'desc' } },
          },
        },
      },
    );

    const sanitizeData = this.sanitizeData(clinics.data);
    const headerData = this.getHeader();
    const titleData = this.getTitle(headerData);
    const infoData = this.getEndInformation(clinics.data.length);

    const returnData: IReportFactoryProductFindData = { headerRow: headerData, titleRows: titleData, endRows: infoData, sanitizeData };

    return returnData;
  }

  public sanitizeData(clinics: CompanyEntity[]): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = clinics.map<IReportSanitizeData>((clinic) => {
      const contact = clinic?.contacts?.[0];
      const address = clinic?.address;

      const scheduleType = clinicScheduleMap[clinic?.clinicExams?.[0]?.scheduleType]?.name || '';
      const paymentType = companyPaymentScheduleMap[clinic.paymentType]?.name || '';
      const street = `${clinic?.address?.street || ''}, ${clinic?.address?.number || ''}`;

      const sanitazeRow: IReportSanitizeData = {
        fantasy: { content: clinic.fantasy },
        unit: { content: clinic.unit },
        paymentDay: { content: clinic.paymentDay },
        paymentType: { content: paymentType },
        cep: { content: formatCEP(address.cep) },
        city: { content: address.city },
        UF: { content: address.state || address.uf },
        email: { content: contact?.email },
        phone1: { content: formatPhoneNumber(contact?.phone) },
        phone2: { content: formatPhoneNumber(contact?.phone_1) },
        street: { content: street },
        scheduleType: { content: scheduleType },
      };

      return sanitazeRow;
    });

    return rows;
  }

  public getFilename(): string {
    const date = new Date();
    const filename = `Relatorio de clínicas ${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    return filename;
  }

  public getSheetName(): string {
    const name = `Clínicas Cadastradas`;

    return name;
  }

  public getHeader(): IReportHeader {
    const header = [
      { database: 'fantasy', content: 'Nome', width: 100 },
      { database: 'unit', content: 'Unidade', width: 50 },
      { database: 'street', content: 'Endereço', width: 120 },
      { database: 'cep', content: 'CEP', width: 20 },
      { database: 'city', content: 'Cidade', width: 40 },
      { database: 'UF', content: 'state', width: 10 },
      { database: 'phone1', content: 'Telefone 1', width: 15 },
      { database: 'phone2', content: 'Telefone 2', width: 15 },
      { database: 'email', content: 'Email', width: 60 },
      { database: 'paymentDay', content: 'Dia Faturamento', width: 20 },
      { database: 'paymentType', content: 'Tipo Faturamento', width: 20 },
      { database: 'scheduleType', content: 'Tipo Agendamento', width: 20 },
    ];

    return header;
  }

  public getTitle(header: IReportHeader): IReportCell[][] {
    const row: IReportCell[] = [{ content: 'Relação de clínicas credenciadas', mergeRight: header.length }];
    const rows = [row];

    return rows;
  }

  public getEndInformation(count: number): IReportCell[][] {
    const row: IReportCell[] = [{ content: `Total: ${count}`, mergeRight: 'all' }];
    const rows = [row];

    return rows;
  }
}
