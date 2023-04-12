import { CompanyRepository } from './../../../../company/repositories/implementations/CompanyRepository';
import { Injectable } from '@nestjs/common';

import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { ReportFactoryAbstractionCreator } from '../creator/ReportFactoryCreator';
import { IReportCell, IReportFactoryProduct, IReportFactoryProductFindData, IReportHeader, IReportSanitizeData } from '../types/IReportFactory.types';
import { getCompanyName } from './../../../../../shared/utils/companyName';
import { FindEmployeeDto } from './../../../../company/dto/employee.dto';
import { EmployeeEntity } from './../../../../company/entities/employee.entity';
import { EmployeeRepository } from './../../../../company/repositories/implementations/EmployeeRepository';
import { FindCompaniesDto } from '../../../../company/dto/company.dto';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class ReportExpiredExamFactory extends ReportFactoryAbstractionCreator<FindEmployeeDto> {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly excelProv: ExcelProvider,
    private readonly employeeRepository: EmployeeRepository,
    private readonly dayjsProvider: DayJSProvider,
  ) {
    super(excelProv, companyRepository);
  }

  public factoryMethod(): IReportFactoryProduct<FindEmployeeDto> {
    return new ReportFactoryProduct(this.employeeRepository, this.dayjsProvider);
  }
}

class ReportFactoryProduct implements IReportFactoryProduct<FindEmployeeDto> {
  constructor(private readonly employeeRepository: EmployeeRepository, private readonly dayjsProvider: DayJSProvider) {}

  public async findTableData(companyId: string, { skip, take, ...query }: FindEmployeeDto) {
    query.expiredExam = true;
    query.all = true;
    query.status = ['ACTIVE'];
    query.companyId = companyId;
    query.lteExpiredDateExam = query.lteExpiredDateExam || new Date();

    const employees = await this.employeeRepository.find(
      query,
      { take: take || 10_000, skip: skip || 0 },
      {
        select: {
          birthday: true,
          lastExam: true,
          esocialCode: true,
          hierarchy: { select: { name: true, parent: { select: { name: true, type: true, parent: { select: { name: true, type: true } } } } } },
          company: { select: { unit: true, group: { select: { name: true } } } },
        },
      },
    );

    const sanitizeData = this.sanitizeData(employees.data);
    const headerData = this.getHeader();
    const titleData = this.getTitle(headerData);
    const infoData = this.getEndInformation(employees.data.length);

    const returnData: IReportFactoryProductFindData = { headerRow: headerData, titleRows: titleData, endRows: infoData, sanitizeData };

    return returnData;
  }

  public sanitizeData(employees: EmployeeEntity[]): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = employees.map<IReportSanitizeData>((employee) => {
      const sanitazeRow: IReportSanitizeData = {
        group: { content: employee.company?.group?.name },
        company: { content: getCompanyName(employee.company) },
        unit: { content: employee.company.unit },
        cpf: { content: employee.cpf },
        esocialCode: { content: employee.esocialCode },
        name: { content: employee.name },
        birthday: { content: employee.birthday ? this.dayjsProvider.format(employee.birthday) : '' },
        sector: { content: employee.sectorHierarchy?.name || '' },
        hierarchy: { content: employee?.hierarchy?.name || '' },
        lastExam: {
          content: employee.lastExam || employee.lastDoneExam?.doneDate ? this.dayjsProvider.format(employee.lastDoneExam?.doneDate || employee.lastExam) : '',
        },
        expiredDateExam: { content: employee.expiredDateExam && employee.expiredDateExam.getFullYear() > 1901 ? employee.expiredDateExam : '' },
        scheduleDate: { content: employee?.scheduleExam?.doneDate ? this.dayjsProvider.format(employee?.scheduleExam?.doneDate) : '' },
      };

      return sanitazeRow;
    });

    return rows;
  }

  public getFilename(): string {
    const date = new Date();
    const filename = `Exames Vencidos ${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    return filename;
  }

  public getSheetName(): string {
    const name = `Exames Vencidos`;

    return name;
  }

  public getHeader(): IReportHeader {
    const header = [
      { database: 'group', content: 'Grupo Empresarial', width: 40 },
      { database: 'company', content: 'Empresa', width: 60 },
      { database: 'unit', content: 'Unidade', width: 30 },
      { database: 'cpf', content: 'CPF', width: 20 },
      { database: 'esocialCode', content: 'Matrícula', width: 30 },
      { database: 'name', content: 'Nome', width: 60 },
      { database: 'birthday', content: 'Nascimento', width: 20 },
      { database: 'sector', content: 'Setor', width: 40 },
      { database: 'hierarchy', content: 'Cargo', width: 40 },
      { database: 'lastExam', content: 'Ult. Exame', width: 20 },
      { database: 'expiredDateExam', content: 'Vencimento', width: 20 },
      { database: 'scheduleDate', content: 'Agendamento', width: 20 },
    ];

    return header;
  }

  public getTitle(header: IReportHeader): IReportCell[][] {
    const row: IReportCell[] = [{ content: 'Exames Vencidos', mergeRight: header.length }];
    const rows = [row];

    return rows;
  }

  public getEndInformation(count: number): IReportCell[][] {
    const row: IReportCell[] = [{ content: `Total: ${count}`, mergeRight: 'all' }];
    const rows = [row];

    return rows;
  }
}
