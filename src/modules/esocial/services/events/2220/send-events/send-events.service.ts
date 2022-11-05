import { BadRequestException, Injectable } from '@nestjs/common';
import format from 'xml-formatter';

import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeExamsHistoryRepository } from '../../../../../company/repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { Event2220Dto } from './../../../../dto/event.dto';

@Injectable()
export class SendEvents2220ESocialService {
  constructor(
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(body: Event2220Dto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const { company, cert } = await this.eSocialMethodsProvider.getCompanyCert(
      companyId,
    );

    const startDate = company.esocialStart;

    if (!startDate)
      throw new BadRequestException('Data de início do eSocial não informado');

    const { data: employees } = await this.employeeRepository.findEvent2220(
      {
        startDate,
        companyId,
      },
      { take: 1000 },
    );

    const eventsStruct = this.eSocialEventProvider.convertToEventStruct(
      company,
      employees,
      body,
    );

    const eventsXml = eventsStruct.map((data) => {
      const xmlResult = this.eSocialEventProvider.generateXmlEvent2220(
        data.event,
      );

      return format(xmlResult, {
        indentation: '  ',
        filter: (node) => node.type !== 'Comment',
        collapseContent: true,
        lineSeparator: '\n',
      });
    });

    return eventsXml[0];
    // console.log(xmlResult);

    //*
    // const signedXml = this.eSocialEventProvider.signEvent({
    //   xml: xmlResult,
    //   cert,
    // });

    // return signedXml;
  }
}

// const generateId = this.eSocialMethodsProvider.classGenerateId(companyId);
// const eventsInterface = employeesFound.reduce<
//   {
//     event: IEvent2220Props;
//     asoId: number;
//     employeeId: number;
//     companyId: string;
//   }[]
// >((acc, employee) => {
//   const examsGroup = employee.examsHistory.reduce<
//     EmployeeExamsHistoryEntity[][]
//   >(
//     (_acc, exam) => {
//       const cloneAcc = clone(_acc);
//       const lastIndex = cloneAcc.length - 1;

//       cloneAcc[lastIndex].push(exam);

//       if (exam.exam.isAttendance) {
//         cloneAcc.push([]);
//       }

//       return cloneAcc;
//     },
//     [[]],
//   );

//   const examsWithAso = examsGroup.filter((exams) =>
//     exams.some((e) => e.exam.isAttendance),
//   );

//   const eventsJs = examsWithAso.map<{
//     event: IEvent2220Props;
//     asoId: number;
//     employeeId: number;
//     companyId: string;
//   }>((exams) => {
//     const aso = exams[exams.length - 1];
//     const eventMed: IEvent2220Props['exMedOcup'] = {
//       respMonit: {
//         cpfResp: company?.doctorResponsible?.cpf,
//         nmResp: company?.doctorResponsible?.name,
//         nrCRM: company?.doctorResponsible?.councilId,
//         ufCRM: company?.doctorResponsible?.councilUF,
//       },
//       tpExameOcup: mapResAso[aso.examType],
//       aso: {
//         dtAso: aso.doneDate,
//         resAso: mapTpExameOcup[aso.evaluationType],
//         medico: {
//           nmMed: aso?.doctor?.name,
//           nrCRM: aso?.doctor?.councilId,
//           ufCRM: aso?.doctor?.councilUF,
//         },
//         exame: exams.map((exam) => {
//           let isSequential: boolean | null = null;
//           let obsProc: string | null = null;
//           const esocial27Code = exam.exam?.esocial27Code;
//           if (requiredOrdExams.includes(esocial27Code)) {
//             isSequential =
//               !!employee.examsHistory.filter(
//                 (e) =>
//                   e.status === 'DONE' &&
//                   e?.exam?.esocial27Code === exam.exam.esocial27Code,
//               )[1] ||
//               (examsWithAso.length === 1 &&
//                 aso.examType !== ExamHistoryTypeEnum.ADMI);
//           }

//           if (requiredObsProc.includes(esocial27Code)) {
//             obsProc = exam.exam?.obsProc;
//           }

//           return {
//             examName: exam.exam.name,
//             dtExm: exam.doneDate,
//             procRealizado: esocial27Code,
//             ...(isSequential != null && {
//               ordExame: isSequential ? 2 : 1,
//             }),
//             ...(obsProc != null && { obsProc }),
//           };
//         }),
//       },
//     };

//     // aso.event. //?

//     const event: IEvent2220Props = {
//       id: generateId.newId(),
//       exMedOcup: eventMed,
//       ideEmpregador: { nrInsc: company.cnpj },
//       ideVinculo: {
//         cpfTrab: employee.cpf,
//         matricula: employee.esocialCode,
//       },
//       ideEvento: {
//         tpAmb: body.tpAmb,
//         procEmi: body.procEmi,
//       },
//     };

//     return {
//       event: event,
//       asoId: aso.id,
//       employeeId: employee.id,
//       companyId: employee.companyId,
//     };
//   });

//   acc = [...eventsJs, ...acc];
//   return acc;
// }, []);
