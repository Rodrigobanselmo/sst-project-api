import { StatusExamEnum } from './../../../../../shared/constants/enum/statusExam.enum';
import { ExamEntity } from './../../../../sst/entities/exam.entity';
import { FindAllAvailableEmployeesService } from './../../../../company/services/employee/find-all-available-employees/find-all-available-employees.service';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { Injectable } from '@nestjs/common';

import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { ReportFactoryAbstractionCreator } from '../creator/ReportFactoryCreator';
import {
  IReportCell,
  IReportFactoryProduct,
  IReportFactoryProductFindData,
  IReportHeader,
  IReportSanitizeData,
  ReportFillColorEnum,
} from '../types/IReportFactory.types';
import { getCompanyName } from '../../../../../shared/utils/companyName';
import { FindEmployeeDto } from '../../../../company/dto/employee.dto';
import { EmployeeEntity } from '../../../../company/entities/employee.entity';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { FindCompaniesDto } from '../../../../company/dto/company.dto';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import sortArray from 'sort-array';

@Injectable()
export class ReportExpiredComplementaryExamFactory extends ReportFactoryAbstractionCreator<FindEmployeeDto> {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly excelProv: ExcelProvider,
    private readonly findAllAvailableEmployeesService: FindAllAvailableEmployeesService,
    private readonly employeeRepository: EmployeeRepository,
    private readonly dayjsProvider: DayJSProvider,
  ) {
    super(excelProv, companyRepository);
  }

  public factoryMethod(): IReportFactoryProduct<FindEmployeeDto> {
    return new ReportFactoryProduct(this.employeeRepository, this.dayjsProvider, this.findAllAvailableEmployeesService);
  }
}

class ReportFactoryProduct implements IReportFactoryProduct<FindEmployeeDto> {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly dayjsProvider: DayJSProvider,
    private readonly findAllAvailableEmployeesService: FindAllAvailableEmployeesService,
  ) {}

  public async findTableData(companyId: string, { skip, take, ...query }: FindEmployeeDto) {
    query.getAllExams = true;
    query.getAllExamsWithSchedule = true;
    query.noPagination = true;
    // query.getSector = true;
    // query.getGroup = true;
    // query.getEsocialCode = true;
    // query.status = ['ACTIVE'];
    query.companyId = companyId;
    query.all = true;

    const employees = await this.findAllAvailableEmployeesService.execute(query, { companyId, targetCompanyId: companyId } as any);

    const sortedExams = sortArray(employees.exams, { by: 'isAttendance', order: 'desc' });

    const sanitizeData = this.sanitizeData(employees.data, sortedExams);
    const headerData = this.getHeader(sortedExams);
    const titleData = this.getTitle(headerData);
    const infoData = this.getEndInformation(employees.data.length);

    const returnData: IReportFactoryProductFindData = { headerRow: headerData, titleRows: titleData, endRows: infoData, sanitizeData };

    return returnData;
  }

  public sanitizeData(employees: EmployeeEntity[], sortedExams: ExamEntity[]): IReportSanitizeData[] {
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
        ...sortedExams.reduce((acc, exam) => {
          const examFound = employee.infoExams?.[exam.id];
          if (!examFound) return acc;

          if (!acc[exam.id])
            acc[exam.id] = {
              content: examFound.validityDateString || '',
            };

          if (examFound.status == StatusExamEnum.EXPIRED) acc[exam.id].fill = ReportFillColorEnum.EXPIRED;
          if ([StatusExamEnum.CLOSE_1, StatusExamEnum.CLOSE_2, StatusExamEnum.CLOSE_3].includes(examFound.status))
            acc[exam.id].fill = ReportFillColorEnum.CLOSE_TO_EXPIRED;
          if (examFound.status == StatusExamEnum.DONE) acc[exam.id].fill = ReportFillColorEnum.GREEN;
          if (examFound.status == StatusExamEnum.PROCESSING) acc[exam.id].fill = ReportFillColorEnum.BLUE;
          if (examFound.status == StatusExamEnum.PENDING) acc[exam.id].fill = ReportFillColorEnum.BLUE;

          return acc;
        }, {}),
      };

      return sanitazeRow;
    });

    return rows;
  }

  public getFilename(): string {
    const date = new Date();
    const filename = `Exames Complementares ${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    return filename;
  }

  public getSheetName(): string {
    const name = `Exames Complementares`;

    return name;
  }

  public getHeader(sortedExams: ExamEntity[]): IReportHeader {
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
      ...sortedExams.map<IReportHeader[0]>((exam) => {
        return {
          database: String(exam.id),
          content: exam.name,
          width: 50,
        };
      }),
    ];

    return header;
  }

  public getTitle(header: IReportHeader): IReportCell[][] {
    const row: IReportCell[] = [{ content: 'Exames Vencidos', mergeRight: header.length - 1 }];
    const rows = [row];

    return rows;
  }

  public getEndInformation(count: number): IReportCell[][] {
    const row: IReportCell[] = [{ content: `Total: ${count}`, mergeRight: 'all' }];
    const rows = [row];

    return rows;
  }
}
