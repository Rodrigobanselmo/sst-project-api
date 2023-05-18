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
  ReportColorEnum,
  ReportFillColorEnum,
} from '../types/IReportFactory.types';
import { getCompanyName } from '../../../../../shared/utils/companyName';
import { FindEmployeeDto, ReportComplementaryExamDto } from '../../../../company/dto/employee.dto';
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
  ) { }

  public async findTableData(companyId: string, { skip, take, examsInHorizontal, ...query }: ReportComplementaryExamDto) {
    query.getAllExams = true;
    query.getAllExamsWithSchedule = true;
    query.noPagination = true;
    query.getSector = true;
    query.getGroup = true;
    query.getEsocialCode = true;
    query.companyId = companyId;
    query.all = true;
    // query.status = ['ACTIVE'];

    const employees = await this.findAllAvailableEmployeesService.execute(query, { companyId, targetCompanyId: companyId } as any);

    const sortedExams = sortArray(employees.exams, { by: ['isAttendance', 'name'], order: ['desc', 'asc'] });

    const sanitizeData = this.sanitizeData(employees.data, sortedExams, { examsInHorizontal });
    const headerData = this.getHeader(sortedExams, { examsInHorizontal });
    const titleData = this.getTitle(headerData);
    const infoData = this.getEndInformation(employees.data, sortedExams);

    const returnData: IReportFactoryProductFindData = { headerRow: headerData, titleRows: titleData, endRows: infoData, sanitizeData };

    return returnData;
  }

  public sanitizeData(employees: EmployeeEntity[], sortedExams: ExamEntity[], { examsInHorizontal }: { examsInHorizontal?: boolean }): IReportSanitizeData[] {
    const rows: (IReportSanitizeData | IReportSanitizeData[])[] = employees.map<IReportSanitizeData | IReportSanitizeData[]>((employee) => {

      if (examsInHorizontal) {
        const sanitazeRow: IReportSanitizeData = {
          group: { content: employee.company?.group?.name },
          company: { content: getCompanyName(employee.company) },
          unit: { content: employee.company.unit },
          rg: { content: employee.rg },
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

            if (examFound.status == StatusExamEnum.EXPIRED) acc[exam.id].color = ReportColorEnum.EXPIRED;
            if ([StatusExamEnum.CLOSE_1, StatusExamEnum.CLOSE_2, StatusExamEnum.CLOSE_3].includes(examFound.status))
              acc[exam.id].color = ReportColorEnum.CLOSE_TO_EXPIRED;
            if (examFound.status == StatusExamEnum.DONE) acc[exam.id].color = ReportColorEnum.GREEN;
            if (examFound.status == StatusExamEnum.PROCESSING) acc[exam.id].color = ReportColorEnum.BLUE;
            if (examFound.status == StatusExamEnum.PENDING) acc[exam.id].color = ReportColorEnum.BLUE;

            return acc;
          }, {}),
        };

        return sanitazeRow;
      }

      let pass = false;
      const sanitazeRows = sortedExams.map((exam) => {
        const examFound = employee.infoExams?.[exam.id];
        if (!examFound) return;

        const color = !pass ? undefined : ReportColorEnum.LIGHT_GREY

        const sanitazeRow: IReportSanitizeData = {
          group: { content: employee.company?.group?.name, color },
          company: { content: getCompanyName(employee.company), color },
          unit: { content: employee.company.unit, color },
          rg: { content: employee.rg, color },
          cpf: { content: employee.cpf, color },
          esocialCode: { content: employee.esocialCode, color },
          name: { content: employee.name, color },
          birthday: { content: employee.birthday ? this.dayjsProvider.format(employee.birthday) : '', color },
          sector: { content: employee.sectorHierarchy?.name || '', color },
          hierarchy: { content: employee?.hierarchy?.name || '', color },

          lastExam: { content: examFound.lastDoneExamDate },
          expiredDateExam: { content: examFound.expiredDate },
          scheduleDate: { content: examFound.lastScheduleExamDate },
        };

        sanitazeRow.exam = { content: exam.name || '' };

        if (examFound.status == StatusExamEnum.EXPIRED) sanitazeRow.expiredDateExam.color = ReportColorEnum.EXPIRED;
        if ([StatusExamEnum.CLOSE_1, StatusExamEnum.CLOSE_2, StatusExamEnum.CLOSE_3].includes(examFound.status)) sanitazeRow.expiredDateExam.color = ReportColorEnum.CLOSE_TO_EXPIRED;
        if (examFound.status == StatusExamEnum.DONE) sanitazeRow.expiredDateExam.color = ReportColorEnum.GREEN;


        pass = true;
        return sanitazeRow;
      }).filter(i => i)

      return sanitazeRows;
    });

    return rows.flat(1);
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

  public getHeader(sortedExams: ExamEntity[], { examsInHorizontal }: { examsInHorizontal?: boolean }): IReportHeader {
    const header: IReportHeader = [
      { database: 'group', content: 'Grupo Empresarial', width: 40 },
      { database: 'company', content: 'Empresa', width: 60 },
      { database: 'unit', content: 'Unidade', width: 30 },
      { database: 'rg', content: 'RG', width: 20 },
      { database: 'cpf', content: 'CPF', width: 20 },
      { database: 'esocialCode', content: 'Matrícula', width: 30 },
      { database: 'name', content: 'Nome', width: 60 },
      { database: 'birthday', content: 'Nascimento', width: 20 },
      { database: 'sector', content: 'Setor', width: 40 },
      { database: 'hierarchy', content: 'Cargo', width: 40 },
      ...(examsInHorizontal ? [] : [{ database: 'exam', content: 'Exame', width: 60 }]),
      { database: 'lastExam', content: 'Ult. Exame', width: 20 },
      { database: 'expiredDateExam', content: 'Vencimento', width: 20 },
      { database: 'scheduleDate', content: 'Agendamento', width: 20 },
    ];

    if (examsInHorizontal) {
      header.push(
        ...sortedExams.map<IReportHeader[0]>((exam) => {
          return {
            database: String(exam.id),
            content: exam.name,
            width: 50,
          };
        })
      )
    }

    return header;
  }

  public getTitle(header: IReportHeader): IReportCell[][] {
    const row: IReportCell[] = [{ content: 'Exames Vencidos', mergeRight: header.length - 1 }];
    const rows = [row];

    return rows;
  }

  public getEndInformation(employees: EmployeeEntity[], sortedExams: ExamEntity[]): IReportCell[][] {
    const totalByExam: Record<number, any> = {};

    sortedExams.forEach((exam) => {
      totalByExam[exam.id] = {
        total: 0,
        done: 0,
        processing: 0,
        closeToExpired: 0,
        expired: 0,
        name: exam.name,
        clinic: exam.isAttendance
      };
    })

    employees.forEach((employee) => {

      Object.entries(employee.infoExams).forEach(([examId, info]) => {
        if (!info) return;

        totalByExam[examId].total++;
        if (info.status == StatusExamEnum.EXPIRED) totalByExam[examId].expired++;
        if ([StatusExamEnum.CLOSE_1, StatusExamEnum.CLOSE_2, StatusExamEnum.CLOSE_3].includes(info.status)) totalByExam[examId].closeToExpired++;
        if (info.status == StatusExamEnum.DONE) totalByExam[examId].done++;
        if (info.status == StatusExamEnum.PROCESSING) totalByExam[examId].processing++;
        if (info.status == StatusExamEnum.PENDING) totalByExam[examId].processing++;
      })


    });


    const row: IReportCell[] = [{ content: `Exames`, mergeRight: 'all' }];
    const rows = [row];

    sortedExams.forEach((exam) => {
      if (totalByExam[exam.id]) {
        const nameExam = (`${totalByExam[exam.id].name}`)
        const doneText = (`em dia: ${totalByExam[exam.id].done};`)
        const closeText = (`a vencer: ${totalByExam[exam.id].closeToExpired};`)
        const expiredText = (`vencidos: ${totalByExam[exam.id].expired};`)
        const scheduleText = (`agendados: ${totalByExam[exam.id].processing};`)

        const row: IReportCell[] = [
          { content: `${nameExam}`, },
          { content: `${doneText}`, },
          { content: `${closeText}`, },
          { content: `${scheduleText}`, },
          { content: `${expiredText}`, },
          { content: `total: ${totalByExam[exam.id].total}`, mergeRight: 10 },
        ];

        rows.push(row);
      }
    });

    return rows;
  }
}
