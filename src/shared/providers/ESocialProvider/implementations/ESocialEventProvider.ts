import { CompanyEntity } from './../../../../modules/company/entities/company.entity';
import { EmployeeExamsHistoryEntity } from './../../../../modules/company/entities/employee-exam-history.entity';
import { EmployeeEntity } from 'src/modules/company/entities/employee.entity';
import { Injectable } from '@nestjs/common';
import { js2xml } from 'xml-js';
import clone from 'clone';

import { PrismaService } from '../../../../prisma/prisma.service';
import { DayJSProvider } from '../../DateProvider/implementations/DayJSProvider';
import {
  IEvent2220Props,
  mapResAso,
  mapTpExameOcup,
  requiredObsProc,
  requiredOrdExams,
} from '../../../../modules/esocial/interfaces/event-2220';
import { IEventProps } from '../../../../modules/esocial/interfaces/event-batch';
import { ExamHistoryTypeEnum } from '@prisma/client';
import { ESocialMethodsProvider } from './ESocialMethodsProvider';

@Injectable()
class ESocialEventProvider {
  private verProc = 'Simple_SST_eSocial 1.0';
  private indRetif = 1;
  private tpAmb = 1;
  private procEmi = 1;
  private tpInsc = 1;

  constructor(
    private readonly prisma: PrismaService,
    private readonly dayJSProvider: DayJSProvider,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
  ) {}

  public generateXmlEvent2220(event: IEvent2220Props) {
    const baseEvent = this.generateEventBase(event);
    const exMedOcup = event.exMedOcup;
    const respMonit = exMedOcup.respMonit;
    const aso = exMedOcup.aso;
    const asoDoctor = aso.medico;
    const exams = aso.exame;

    const eventJs = {
      eSocial: {
        ['_attributes']: {
          xmlns: 'http://www.esocial.gov.br/schema/evt/evtMonit/v_S_01_00_00',
        },
        evtMonit: {
          ['_attributes']: {
            Id: event.id,
          },
          ...baseEvent,
          exMedOcup: {
            tpExameOcup: { ['_text']: exMedOcup.tpExameOcup },
            aso: {
              dtAso: {
                ['_text']: this.convertDate(aso.dtAso),
              },
              resAso: { ['_text']: aso.resAso },
              medico: {
                nmMed: { ['_text']: asoDoctor.nmMed },
                nrCRM: { ['_text']: asoDoctor.nrCRM },
                ufCRM: { ['_text']: asoDoctor.ufCRM },
              },
              exame: exams.map((exam) => ({
                dtExm: { ['_text']: this.convertDate(exam.dtExm) },
                procRealizado: { ['_text']: exam.procRealizado },
                ...(exam.ordExame && { ['_text']: exam.ordExame }),
                ...(exam.obsProc && { ['_text']: exam.obsProc }),
                ...(exam.indResult && { ['_text']: exam.indResult }),
              })),
            },
            respMonit: {
              cpfResp: { ['_text']: respMonit.cpfResp },
              nmResp: { ['_text']: respMonit.nmResp },
              nrCRM: { ['_text']: respMonit.nrCRM },
              ufCRM: { ['_text']: respMonit.ufCRM },
            },
          },
        },
      },
    };

    const xml = js2xml(eventJs, { compact: true })?.replace('<?xml?>', '');

    return xml;
  }

  public errorsEvent2220(event: IEvent2220Props) {
    const exMedOcup = event.exMedOcup;
    const respMonit = exMedOcup.respMonit;
    const aso = exMedOcup.aso;
    const asoDoctor = aso.medico;
    const exams = aso.exame;
    const ideVinculo = event.ideVinculo;

    const errors = [];

    {
      if (!ideVinculo.cpfTrab)
        errors.push({ message: 'Informar "CPF" do empregado' });
      if (!ideVinculo.matricula)
        errors.push({ message: 'Informar "matricula" do empregado' });
    }

    {
      if (!respMonit.cpfResp)
        errors.push({
          message: 'Informar "CPF" do médico coordenador do PCMSO',
        });
      if (!respMonit.nrCRM || !respMonit.ufCRM)
        errors.push({
          message: 'Informar "CRM" do médico coordenador do PCMSO',
        });
      if (!respMonit.nmResp)
        errors.push({
          message: 'Informar "nome" do médico coordenador do PCMSO',
        });
    }

    {
      if (!asoDoctor.nrCRM || !asoDoctor.ufCRM)
        errors.push({ message: 'Informar "CRM" do médico emitente do ASO' });
      if (!asoDoctor.nmMed)
        errors.push({
          message: 'Informar "nome" do médico emitente do ASO',
        });
    }

    {
      if (!exMedOcup.tpExameOcup)
        errors.push({
          message: 'Informar "tipo de exame" (ex: Admissional) do empregado',
        });

      if (!aso.dtAso)
        errors.push({
          message: 'Informar "data" do exame',
        });
    }

    exams.map((exam) => {
      if (requiredObsProc.includes(exam.procRealizado)) {
        errors.push({
          message: `Informar "Observação sobre o procedimento diagnóstico realizado" do exam ${exam.examName}`,
        });
      }
      if (requiredOrdExams.includes(exam.procRealizado)) {
        errors.push({
          message: `Informar se exame é sequencial ou inicial (${exam.examName})`,
        });
      }
    });

    return errors;
  }

  public convertToEventStruct(
    company: CompanyEntity,
    employees: EmployeeEntity[],
    ideEvento?: IEventProps['ideEvento'],
  ) {
    const companyId = company.id;
    const generateId = this.eSocialMethodsProvider.classGenerateId(companyId);
    const eventsStruct = employees.reduce<
      {
        event: IEvent2220Props;
        employee: EmployeeEntity;
        asoId: number;
      }[]
    >((acc, employee) => {
      const examsGroup = employee.examsHistory.reduce<
        EmployeeExamsHistoryEntity[][]
      >(
        (_acc, exam) => {
          const cloneAcc = clone(_acc);
          const lastIndex = cloneAcc.length - 1;

          cloneAcc[lastIndex].push(exam);

          if (exam.exam.isAttendance) {
            cloneAcc.push([]);
          }

          return cloneAcc;
        },
        [[]],
      );

      const examsWithAso = examsGroup.filter((exams) =>
        exams.some((e) => e.exam.isAttendance),
      );

      const eventsJs = examsWithAso.map<{
        event: IEvent2220Props;
        employee: EmployeeEntity;
        asoId: number;
      }>((exams) => {
        const aso = exams[exams.length - 1];
        const eventMed: IEvent2220Props['exMedOcup'] = {
          respMonit: {
            cpfResp: company?.doctorResponsible?.cpf,
            nmResp: company?.doctorResponsible?.name,
            nrCRM: company?.doctorResponsible?.councilId,
            ufCRM: company?.doctorResponsible?.councilUF,
          },
          tpExameOcup: mapResAso[aso.examType],
          aso: {
            dtAso: aso.doneDate,
            resAso: mapTpExameOcup[aso.evaluationType],
            medico: {
              nmMed: aso?.doctor?.name,
              nrCRM: aso?.doctor?.councilId,
              ufCRM: aso?.doctor?.councilUF,
            },
            exame: exams.map((exam) => {
              let isSequential: boolean | null = null;
              let obsProc: string | null = null;
              const esocial27Code = exam.exam?.esocial27Code;
              if (requiredOrdExams.includes(esocial27Code)) {
                isSequential =
                  !!employee.examsHistory.filter(
                    (e) =>
                      e.status === 'DONE' &&
                      e?.exam?.esocial27Code === exam.exam.esocial27Code,
                  )[1] ||
                  (examsWithAso.length === 1 &&
                    aso.examType !== ExamHistoryTypeEnum.ADMI);
              }

              if (requiredObsProc.includes(esocial27Code)) {
                obsProc = exam.exam?.obsProc;
              }

              return {
                examName: exam.exam.name,
                dtExm: exam.doneDate,
                procRealizado: esocial27Code,
                ...(isSequential != null && {
                  ordExame: isSequential ? 2 : 1,
                }),
                ...(obsProc != null && { obsProc }),
              };
            }),
          },
        };

        // aso.event. //?

        const event: IEvent2220Props = {
          id: generateId.newId(),
          exMedOcup: eventMed,
          ideEmpregador: { nrInsc: company.cnpj },
          ideVinculo: {
            cpfTrab: employee.cpf,
            matricula: employee.esocialCode,
          },
          ideEvento: {
            tpAmb: ideEvento?.tpAmb,
            procEmi: ideEvento?.procEmi,
          },
        };

        return {
          event: event,
          asoId: aso.id,
          employee: employee,
        };
      });

      acc = [...eventsJs, ...acc];
      return acc;
    }, []);

    return eventsStruct;
  }

  public convertDate(date: Date) {
    return this.dayJSProvider.format(date, 'YYYY-MM-DD');
  }

  private generateEventBase(event: IEventProps) {
    const eventJs = {
      ideEvento: {
        indRetif: {
          ['_text']: event.ideEvento.indRetif || this.indRetif,
        },
        tpAmb: {
          ['_text']: event.ideEvento.tpAmb || this.tpAmb,
        },
        procEmi: {
          ['_text']: event.ideEvento.procEmi || this.procEmi,
        },
        verProc: {
          ['_text']: this.verProc,
        },
        ...(event.ideEvento.nrRecibo && {
          nrRecibo: {
            ['_text']: event.ideEvento.nrRecibo,
          },
        }),
      },
      ideEmpregador: {
        tpInsc: {
          ['_text']: event.ideEmpregador.tpInsc || this.tpInsc,
        },
        nrInsc: {
          ['_text']: event.ideEmpregador.nrInsc,
        },
      },
      ideVinculo: {
        cpfTrab: {
          ['_text']: event.ideVinculo.cpfTrab,
        },
        matricula: {
          ['_text']: event.ideVinculo.matricula,
        },
      },
    };

    return eventJs;
  }
}

export { ESocialEventProvider };
