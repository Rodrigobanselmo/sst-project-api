import { formatCurrency } from '@brazilian-utils/brazilian-utils';
import { Injectable } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

import { EmployeeExamsHistoryEntity } from '../../../../../modules/company/entities/employee-exam-history.entity';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { getCompanyName } from '../../../../../shared/utils/companyName';
import { ReportFactoryAbstractionCreator } from '../creator/ReportFactoryCreator';
import { IReportCell, IReportFactoryProduct, IReportFactoryProductFindData, IReportHeader, IReportSanitizeData } from '../types/IReportFactory.types';
import { employeeExamConclusionTypeMap } from './../../../../../shared/constants/maps/exam-history-conclusion.map';
import { employeeExamEvaluationTypeMap } from './../../../../../shared/constants/maps/exam-history-evaluation.map';
import { employeeExamTypeMap } from './../../../../../shared/constants/maps/exam-history-type.map';
import { FindEmployeeExamHistoryDto } from './../../../../company/dto/employee-exam-history';
import { CompanyRepository } from './../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeExamsHistoryRepository } from './../../../../company/repositories/implementations/EmployeeExamsHistoryRepository';
import { ExamToClinicRepository } from './../../../../sst/repositories/implementations/ExamToClinicRepository';

@Injectable()
export class ReportDoneExamFactory extends ReportFactoryAbstractionCreator<FindEmployeeExamHistoryDto> {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly examToClinicRepository: ExamToClinicRepository,
    private readonly excelProv: ExcelProvider,
    private readonly dayjsProvider: DayJSProvider,
  ) {
    super(excelProv, companyRepository);
  }

  public factoryMethod(): IReportFactoryProduct<FindEmployeeExamHistoryDto> {
    return new ReportFactoryProduct(this.employeeExamHistoryRepository, this.examToClinicRepository, this.dayjsProvider);
  }
}

class ReportFactoryProduct implements IReportFactoryProduct<FindEmployeeExamHistoryDto> {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly examToClinicRepository: ExamToClinicRepository,
    private readonly dayjsProvider: DayJSProvider,
  ) {}

  public async findTableData(companyId: string, { skip, take, ...query }: FindEmployeeExamHistoryDto) {
    const clinicsIds = query.clinicsIds;
    const examToClinic = clinicsIds
      ? await this.examToClinicRepository.findNude({
          select: { companyId: true, examId: true, price: true },
          where: { companyId: { in: clinicsIds }, endDate: null },
        })
      : [];

    const examToClinicMap = examToClinic.reduce((acc, { examId, companyId, ...curr }) => {
      return { ...acc, [`${companyId}${examId}`]: curr };
    }, {} as Record<string, { price: number }>);

    const employeesExams = await this.employeeExamHistoryRepository.find(
      {
        ...query,
        allCompanies: true,
        companyId,
      },
      { skip, take },
      {
        select: {
          doneDate: true,
          doctor: { select: { professional: { select: { name: true } } } },
          fileUrl: true,
          examType: true,
          evaluationType: true,
          conclusion: true,
          clinicId: true,
          examId: true,
          userSchedule: { select: { email: true, name: true } },
          exam: { select: { id: true, name: true } },
          clinic: { select: { fantasy: true } },
          status: true,
          employee: {
            select: {
              name: true,
              cpf: true,
              hierarchy: { select: { name: true } },
              company: {
                select: {
                  name: true,
                  initials: true,
                  fantasy: true,
                  group: { select: { name: true } },
                },
              },
            },
          },
        },
        where: {
          AND: [
            {
              status: StatusEnum.DONE,
            },
          ],
        },
        orderBy: [{ doneDate: 'desc' }],
      },
    );

    const employeesExamsData = clinicsIds
      ? employeesExams.data.map((employeesExam) => {
          const price = examToClinicMap[`${employeesExam.clinicId}${employeesExam.examId}`]?.price;
          employeesExam.price = price / 100 || 0;
          return employeesExam;
        })
      : employeesExams.data;

    const sanitizeData = this.sanitizeData(employeesExamsData, !!clinicsIds);
    const headerData = this.getHeader(!!clinicsIds);
    const titleData = this.getTitle(headerData, query);
    const infoData = this.getEndInformation(employeesExamsData, !!clinicsIds);

    const returnData: IReportFactoryProductFindData = { titleRows: titleData, headerRow: headerData, sanitizeData, endRows: infoData };

    return returnData;
  }

  public sanitizeData(employeesExams: EmployeeExamsHistoryEntity[], isWithPrice: boolean): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = employeesExams.map<IReportSanitizeData>((employeeExam) => {
      const sanitazeRow: IReportSanitizeData = {
        doneDate: { content: this.dayjsProvider.format(employeeExam.doneDate) },
        name: { content: employeeExam.employee.name },
        cpf: { content: employeeExam.employee.cpf },
        hierarchy: { content: employeeExam.employee?.hierarchy?.name },
        exam: { content: employeeExam.exam.name },
        examType: { content: employeeExamTypeMap[employeeExam.examType]?.content },
        evaluationType: {
          content: employeeExamEvaluationTypeMap[employeeExam.evaluationType]?.content,
          color: employeeExamEvaluationTypeMap[employeeExam.evaluationType]?.color,
        },
        fileUrl: { content: employeeExam.fileUrl ? 'Sim' : '' },
        conclusion: { content: employeeExamConclusionTypeMap[employeeExam.conclusion]?.content },
        clinic: { content: employeeExam.clinic.fantasy },
        ...(isWithPrice && {
          price: { content: formatCurrency(employeeExam.price) },
        }),
        doctor: { content: employeeExam.doctor?.name },
        group: { content: employeeExam.employee?.company?.group?.name },
        company: { content: getCompanyName(employeeExam.employee.company) },
        unit: { content: employeeExam.employee.company.unit },
        schedule: { content: employeeExam?.userSchedule?.email },
      };

      return sanitazeRow;
    });

    return rows;
  }

  public getFilename(): string {
    const date = new Date();
    const filename = `Exames Realizados ${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    return filename;
  }

  public getSheetName(): string {
    const name = `Exames Realizados`;

    return name;
  }

  public getHeader(isWithPrice: boolean): IReportHeader {
    const header = [
      { database: 'doneDate', content: 'Data', width: 20 },
      { database: 'name', content: 'Nome', width: 50 },
      { database: 'cpf', content: 'CPF', width: 20 },
      { database: 'hierarchy', content: 'Cargo', width: 40 },
      { database: 'exam', content: 'Exame', width: 60 },
      { database: 'examType', content: 'Tipo de exame', width: 25 },
      { database: 'evaluationType', content: 'Avaliação', width: 15 },
      { database: 'conclusion', content: 'Conclusão', width: 15 },
      { database: 'fileUrl', content: 'Arquivo', width: 15 },
      ...(isWithPrice ? [{ database: 'price', content: 'Preço', width: 15 }] : []),
      { database: 'clinic', content: 'Clínica', width: 60 },
      { database: 'doctor', content: 'Médico', width: 50 },
      { database: 'group', content: 'Grupo Empresarial', width: 30 },
      { database: 'company', content: 'Empresa', width: 60 },
      { database: 'unit', content: 'Unidade', width: 30 },
      { database: 'schedule', content: 'Agendado por:', width: 30 },
    ];

    return header;
  }

  public getTitle(header: IReportHeader, query: FindEmployeeExamHistoryDto): IReportCell[][] {
    const startDate = query.startDate ? this.dayjsProvider.format(query.startDate) : '__/__/____';
    const endDate = query.endDate ? this.dayjsProvider.format(query.endDate) : '__/__/____';

    const row: IReportCell[] = [{ content: 'Exames Realizados', mergeRight: header.length }];
    const row2: IReportCell[] = [{ content: `Périodo: ${startDate} à ${endDate}`, mergeRight: header.length }];
    const rows = [row, row2];

    return rows;
  }

  public getEndInformation(employeeExams: EmployeeExamsHistoryEntity[], isWithPrice: boolean): IReportCell[][] {
    const price = isWithPrice ? `Custo: ${formatCurrency(employeeExams.reduce((acc, curr) => acc + (curr.price || 0), 0))}` : '';

    const row: IReportCell[] = [
      {
        // eslint-disable-next-line prettier/prettier
        content: `Total de exames realizados: (${employeeExams.length})             ${price}`,
        mergeRight: 'all',
      },
    ];
    const rows = [row];

    return rows;
  }
}
