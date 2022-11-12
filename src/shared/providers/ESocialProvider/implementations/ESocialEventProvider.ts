import { asyncEach } from './../../../utils/asyncEach';
import { EmployeeESocialBatchEntity } from './../../../../modules/esocial/entities/employeeEsocialBatch.entity';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ExamHistoryTypeEnum } from '@prisma/client';
import { Cache } from 'cache-manager';
import clone from 'clone';
import { Client } from 'nestjs-soap';
import { CacheEnum } from '../../../../shared/constants/enum/cache';
import { js2xml } from 'xml-js';

import { arrayChunks } from '../../../../shared/utils/arrayChunks';
import { EmployeeEntity } from '../../../../modules/company/entities/employee.entity';
import {
  IEvent2220Props,
  mapResAso,
  mapTpExameOcup,
  requiredObsProc,
  requiredOrdExams,
} from '../../../../modules/esocial/interfaces/event-2220';
import {
  IEventProps,
  ProcEmiEnum,
  TpIncsEnum,
} from '../../../../modules/esocial/interfaces/event-batch';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DayJSProvider } from '../../DateProvider/implementations/DayJSProvider';
import {
  IESocialFetchEventOptions,
  IESocialSendEventOptions,
  IESocialStruck2220,
  IESocialXmlStruck2220,
} from '../models/IESocialMethodProvider';
import { CompanyEntity } from './../../../../modules/company/entities/company.entity';
import { EmployeeExamsHistoryEntity } from './../../../../modules/company/entities/employee-exam-history.entity';
import {
  IEsocialFetchBatch,
  IEsocialSendBatchResponse,
} from './../../../../modules/esocial/interfaces/esocial';
import {
  EventGroupEnum,
  IBatchProps,
  IndRetifEnum,
  TpAmbEnum,
} from './../../../../modules/esocial/interfaces/event-batch';
import { SoapClientEnum } from './../../../constants/enum/soapClient';
import { ICacheEventBatchType } from './../../../interfaces/cache.types';
import { sortNumber } from './../../../utils/sorts/number.sort';
import { ESocialMethodsProvider } from './ESocialMethodsProvider';
import format from 'xml-formatter';

@Injectable()
class ESocialEventProvider {
  private verProc = 'SimplesSST_1.0';
  private indRetif = IndRetifEnum.ORIGINAL;
  private tpAmb = TpAmbEnum.PROD_REST;
  private procEmi = ProcEmiEnum.SOFTWARE;
  private tpInsc = TpIncsEnum.CNPJ;
  private eventGroup = EventGroupEnum.NO_PERIODIC;

  constructor(
    @Inject(SoapClientEnum.PRODUCTION)
    private readonly clientProduction: Client,
    @Inject(SoapClientEnum.PRODUCTION_RESTRICT)
    private readonly clientRestrict: Client,
    @Inject(SoapClientEnum.CONSULT_PRODUCTION)
    private readonly clientConsultProduction: Client,
    @Inject(SoapClientEnum.CONSULT_PRODUCTION_RESTRICT)
    private readonly clientConsultRestrict: Client,
    private readonly prisma: PrismaService,
    private readonly dayJSProvider: DayJSProvider,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
  ) {}

  errorsEvent2220(event: IEvent2220Props) {
    const exMedOcup = event.exMedOcup;
    const respMonit = exMedOcup.respMonit;
    const aso = exMedOcup.aso;
    const asoDoctor = aso.medico;
    const exams = aso.exame;
    const ideVinculo = event.ideVinculo;

    const errors: { message: string }[] = [];

    {
      if (!ideVinculo.cpfTrab)
        errors.push({ message: 'Informar "CPF" do empregado' });
      if (!ideVinculo.matricula)
        errors.push({ message: 'Informar "matricula" do empregado' });
    }

    //? doctor is no more need as an required field
    // {
    //   if (!respMonit.cpfResp && !respMonit.nmResp) {
    //     errors.push({
    //       message: 'Informar o médico coordenador do PCMSO',
    //     });
    //   } else {
    //     // if (!respMonit.cpfResp)
    //     //   errors.push({
    //     //     message: 'Informar "CPF" do médico coordenador do PCMSO',
    //     //   });
    //     if (!respMonit.nmResp)
    //       errors.push({
    //         message: 'Informar "nome" do médico coordenador do PCMSO',
    //       });
    //     if (!respMonit.nrCRM || !respMonit.ufCRM)
    //       errors.push({
    //         message: 'Informar "CRM" do médico coordenador do PCMSO',
    //       });
    //   }
    // }

    {
      if (!asoDoctor.nmMed && !asoDoctor.nrCRM && !asoDoctor.ufCRM) {
        errors.push({
          message: 'Informar o médico emitente do ASO',
        });
      } else {
        if (!asoDoctor.nrCRM || !asoDoctor.ufCRM)
          errors.push({ message: 'Informar "CRM" do médico emitente do ASO' });
        if (!asoDoctor.nmMed)
          errors.push({
            message: 'Informar "nome" do médico emitente do ASO',
          });
      }
    }

    {
      if (!exMedOcup.tpExameOcup && exMedOcup.tpExameOcup != 0)
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

  convertToEvent2220Struct(
    company: CompanyEntity,
    employees: EmployeeEntity[],
    options?: { ideEvento?: IEventProps['ideEvento'] },
  ) {
    const generateId = this.eSocialMethodsProvider.classGenerateId(
      company.cnpj,
    );
    const eventsStruct = employees.reduce<IESocialStruck2220[]>(
      (acc, employee) => {
        const examsGroup = employee.examsHistory
          .sort((a, b) =>
            sortNumber(
              a.exam.isAttendance ? 1 : 0,
              b.exam.isAttendance ? 1 : 0,
            ),
          )
          .sort((a, b) => sortNumber(a.doneDate, b.doneDate))
          .reduce<EmployeeExamsHistoryEntity[][]>(
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

        const examsWithAso = examsGroup.filter(
          (exams) =>
            exams.some((e) => e.exam.isAttendance) &&
            exams.some((e) => e.sendEvent),
        );

        const eventsJs = examsWithAso.map<IESocialStruck2220>((exams) => {
          const aso = exams[exams.length - 1];
          const examIds = [];
          const id = generateId.newId();
          const doctorResponsible = company?.doctorResponsible;

          const isDoctorAvailable =
            doctorResponsible &&
            doctorResponsible?.name &&
            doctorResponsible?.councilId &&
            doctorResponsible?.councilUF;

          const asoDoctor = aso?.doctor;

          const eventMed: IEvent2220Props['exMedOcup'] = {
            ...(isDoctorAvailable && {
              respMonit: {
                ...(doctorResponsible?.cpf && {
                  cpfResp: doctorResponsible.cpf,
                }),
                nmResp: doctorResponsible.name,
                nrCRM: doctorResponsible.councilId,
                ufCRM: doctorResponsible.councilUF,
              },
            }),
            tpExameOcup: mapResAso[aso.examType],
            aso: {
              dtAso: aso.doneDate,
              resAso: mapTpExameOcup[aso.evaluationType],
              medico: {
                nmMed: asoDoctor?.name,
                nrCRM: asoDoctor?.councilId,
                ufCRM: asoDoctor?.councilUF,
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

                examIds.push(exam.id);

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
            id,
            exMedOcup: eventMed,
            ideEmpregador: { nrInsc: company.cnpj },
            ideVinculo: {
              cpfTrab: employee.cpf,
              matricula: employee.esocialCode,
            },
            ideEvento: {
              tpAmb: options?.ideEvento?.tpAmb,
              procEmi: options?.ideEvento?.procEmi,
            },
          };

          return {
            id,
            event: event,
            eventDate: aso.doneDate,
            asoId: aso.id,
            examIds,
            employee: employee,
          };
        });

        acc = [...eventsJs, ...acc];
        return acc;
      },
      [],
    );

    return eventsStruct;
  }

  convertDate(date: Date) {
    return this.dayJSProvider.format(date, 'YYYY-MM-DD');
  }

  generateXmlEvent2220(
    event: IEvent2220Props,
    options?: { declarations?: boolean },
  ) {
    const baseEvent = this.generateEventBase(event);
    const exMedOcup = event.exMedOcup;
    const respMonit = exMedOcup.respMonit;
    const aso = exMedOcup.aso;
    const asoDoctor = aso.medico;
    const exams = aso.exame;

    const eventJs = {
      ...(options?.declarations && {
        _declaration: {
          _attributes: {
            version: '1.0',
            encoding: 'UTF-8',
          },
        },
      }),
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
              exame: exams.map((exam) => ({
                dtExm: { ['_text']: this.convertDate(exam.dtExm) },
                procRealizado: { ['_text']: exam.procRealizado },
                ...(exam.ordExame && { ['_text']: exam.ordExame }),
                ...(exam.obsProc && { ['_text']: exam.obsProc }),
                ...(exam.indResult && { ['_text']: exam.indResult }),
              })),
              medico: {
                nmMed: { ['_text']: asoDoctor.nmMed },
                nrCRM: { ['_text']: asoDoctor.nrCRM },
                ufCRM: { ['_text']: asoDoctor.ufCRM },
              },
            },
            respMonit: {
              // cpfResp: { ['_text']: respMonit.cpfResp },
              nmResp: { ['_text']: respMonit.nmResp },
              nrCRM: { ['_text']: respMonit.nrCRM },
              ufCRM: { ['_text']: respMonit.ufCRM },
            },
          },
        },
      },
    };

    const xml = js2xml(eventJs, { compact: true });
    // if (options?.declarations) xml = xml?.replace('<?xml?>', '');

    return xml;
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

  private generateBatchXML(
    events: IESocialXmlStruck2220[],
    event: IBatchProps,
  ) {
    const xmlEvents = events
      .map((event) => `<evento Id="${event.id}">${event.signedXml}</evento>`)
      .join('');

    const replaceText = 'xml_replace_data';
    const eventJs = {
      // _declaration: {
      //   _attributes: {
      //     version: '1.0',
      //     encoding: 'UTF-8',
      //   },
      // },
      eSocial: {
        ['_attributes']: {
          xmlns: 'http://www.esocial.gov.br/schema/lote/eventos/envio/v1_1_1',
        },
        envioLoteEventos: {
          ['_attributes']: {
            grupo: event.eventGroup || this.eventGroup,
          },
          ideEmpregador: {
            tpInsc: {
              ['_text']: event.ideEmpregador.tpInsc || this.tpInsc,
            },
            nrInsc: {
              ['_text']: event.ideEmpregador.nrInsc,
            },
          },
          ideTransmissor: {
            tpInsc: {
              ['_text']: this.tpInsc,
            },
            nrInsc: {
              ['_text']: process.env.TRANSMISSION_CNPJ,
            },
          },
          eventos: {
            ['_text']: replaceText,
          },
        },
      },
    };

    const xml = js2xml(eventJs, { compact: true })
      .replace(replaceText, xmlEvents)
      .replace('<?xml version="1.0" encoding="UTF-8"?>', '');

    return xml;
  }

  private generateFetchBatchXML(protocolId: string) {
    const eventJs = {
      eSocial: {
        ['_attributes']: {
          xmlns:
            'http://www.esocial.gov.br/schema/lote/eventos/envio/consulta/retornoProcessamento/v1_0_0',
        },
        consultaLoteEventos: {
          protocoloEnvio: {
            ['_text']: protocolId,
          },
        },
      },
    };

    const xml = js2xml(eventJs, { compact: true });
    return xml;
  }

  public async sendEvent2220ToESocial(
    events: IESocialXmlStruck2220[],
    options: IESocialSendEventOptions,
  ) {
    // const eventChunks = arrayChunks(  Array.from({ length: 100 }).map(() => events[0]),  100,);
    const tpAmb = options?.environment || this.tpAmb;
    const eventChunks = arrayChunks(events, 40);

    const responseBatchEvents = await Promise.all(
      eventChunks.map(async (events) => {
        const batchXML = this.generateBatchXML(events, {
          eventGroup: 2,
          ideEmpregador: { nrInsc: options.company?.cnpj },
        });

        const client =
          tpAmb == TpAmbEnum.PROD ? this.clientProduction : this.clientRestrict;

        const sendEventBatch = new Promise<IEsocialSendBatchResponse>(
          (resolve) => {
            client.ServicoEnviarLoteEventos.WsEnviarLoteEventos.EnviarLoteEventos(
              batchXML,
              (e, s) => {
                if (e)
                  return resolve({
                    status: {
                      cdResposta: '500',
                      descResposta: e?.message?.slice(0, 200) + '...',
                    },
                  });

                if (
                  !s?.EnviarLoteEventosResult?.eSocial?.retornoEnvioLoteEventos
                )
                  return resolve({
                    status: {
                      cdResposta: '500',
                      descResposta:
                        'value of (s?.EnviarLoteEventosResult?.eSocial?.retornoEnvioLoteEventos) is undefined',
                    },
                  });

                resolve(
                  s.EnviarLoteEventosResult.eSocial.retornoEnvioLoteEventos,
                );
              },
            );
          },
        );

        const response = await sendEventBatch;

        return { events, response };
      }),
    );

    // fs.writeFileSync(
    //   'tmp/test.xml',
    //   format(batchEvents[0], {
    //     indentation: '  ',
    //     filter: (node) => node.type !== 'Comment',
    //     collapseContent: true,
    //     lineSeparator: '\n',
    //   }),
    // );

    return responseBatchEvents;
  }

  public async fetchEventToESocial(
    batch: EmployeeESocialBatchEntity,
    // options?: IESocialFetchEventOptions,
  ) {
    const protocolId =
      batch.protocolId || batch.response?.dadosRecepcaoLote?.protocoloEnvio;

    const XML = this.generateFetchBatchXML(protocolId);
    const tpAmb = batch.environment || this.tpAmb;

    const client =
      tpAmb == TpAmbEnum.PROD
        ? this.clientConsultProduction
        : this.clientConsultRestrict;

    const fetchEventBatch = new Promise<IEsocialFetchBatch.Response>(
      (resolve) => {
        client.ServicoConsultarLoteEventos[
          'Servicos.Empregador_ServicoConsultarLoteEventos'
        ].ConsultarLoteEventos(XML, (e, s) => {
          if (e)
            return resolve({
              status: {
                cdResposta: '500',
                descResposta: e?.message?.slice(0, 200) + '...',
              },
            });

          if (
            !s?.ConsultarLoteEventosResult?.eSocial
              ?.retornoProcessamentoLoteEventos
          )
            return resolve({
              status: {
                cdResposta: '500',
                descResposta:
                  'value of (s?.ConsultarLoteEventosResult?.eSocial?.retornoProcessamentoLoteEventos) is undefined',
              },
            });

          resolve(
            s.ConsultarLoteEventosResult.eSocial
              .retornoProcessamentoLoteEventos,
          );
        });
      },
    );

    const response = await fetchEventBatch;

    return { batch, response };
  }
}

export { ESocialEventProvider };
