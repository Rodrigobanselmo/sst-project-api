import { sortData } from './../../../utils/sorts/data.sort';
import { Inject, Injectable } from '@nestjs/common';
import { EmployeeESocialEventActionEnum, ExamHistoryTypeEnum, StatusEnum } from '@prisma/client';
import clone from 'clone';
import { Client } from 'nestjs-soap';
import { IEvent3000Props } from '../../../../modules/esocial/interfaces/event-3000';
import { js2xml } from 'xml-js';

import { EmployeeEntity } from '../../../../modules/company/entities/employee.entity';
import { IEvent2220Props, mapResAso, mapTpExameOcup, requiredObsProc, requiredOrdExams } from '../../../../modules/esocial/interfaces/event-2220';
import { IEventProps, ProcEmiEnum, TpIncsEnum } from '../../../../modules/esocial/interfaces/event-batch';
import { PrismaService } from '../../../../prisma/prisma.service';
import { arrayChunks } from '../../../../shared/utils/arrayChunks';
import { DayJSProvider } from '../../DateProvider/implementations/DayJSProvider';
import { IBatchDatabaseSave, IESocial2220, IESocial3000, IESocialSendEventOptions } from '../models/IESocialMethodProvider';
import { CompanyEntity } from './../../../../modules/company/entities/company.entity';
import { EmployeeExamsHistoryEntity } from './../../../../modules/company/entities/employee-exam-history.entity';
import { CreateESocialEvent } from './../../../../modules/esocial/dto/esocial-batch.dto';
import { EmployeeESocialBatchEntity } from './../../../../modules/esocial/entities/employeeEsocialBatch.entity';
import { IEsocialFetchBatch, IEsocialSendBatchResponse } from './../../../../modules/esocial/interfaces/esocial';
import { mapTpEvent } from './../../../../modules/esocial/interfaces/event-3000';
import { EventGroupEnum, IBatchProps, IndRetifEnum, TpAmbEnum } from './../../../../modules/esocial/interfaces/event-batch';
import { ESocialBatchRepository } from './../../../../modules/esocial/repositories/implementations/ESocialBatchRepository';
import { SoapClientEnum } from './../../../constants/enum/soapClient';
import { sortNumber } from './../../../utils/sorts/number.sort';
import { ESocialMethodsProvider } from './ESocialMethodsProvider';

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
    private readonly eSocialBatchRepository: ESocialBatchRepository,
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
      if (!ideVinculo.cpfTrab) errors.push({ message: 'Informar "CPF" do empregado' });
      if (!ideVinculo.matricula) errors.push({ message: 'Informar "matricula" do empregado' });
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
        if (!asoDoctor.nrCRM || !asoDoctor.ufCRM) errors.push({ message: 'Informar "CRM" do médico emitente do ASO' });
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

  errorsEvent3000(event: IEvent3000Props) {
    const infoExclusao = event?.infoExclusao;

    const errors: { message: string }[] = [];

    {
      if (!infoExclusao.ideTrabalhador.cpfTrab) errors.push({ message: 'Informar "CPF" do empregado' });
    }

    {
      if (!infoExclusao.nrRecEvt) errors.push({ message: 'Informar "recibo" do evento' });
      if (!infoExclusao.tpEvento)
        errors.push({
          message: 'Informar "tipo de evento" para a exclusão (ex: S-2240))',
        });
    }

    return errors;
  }

  convertDate(date: Date) {
    return this.dayJSProvider.format(date, 'YYYY-MM-DD');
  }

  convertToEvent2220Struct(company: CompanyEntity, employees: EmployeeEntity[], options?: { ideEvento?: IEventProps['ideEvento'] }) {
    const generateId = this.eSocialMethodsProvider.classGenerateId(company.cnpj);
    const eventsStruct = employees.reduce<IESocial2220.StructureReturn[]>((acc, employee) => {
      const examsGroup = employee.examsHistory
        .sort((a, b) => sortNumber(a.exam.isAttendance ? 1 : 0, b.exam.isAttendance ? 1 : 0))
        .sort((a, b) => sortNumber(a.doneDate, b.doneDate))
        .reduce<EmployeeExamsHistoryEntity[][]>(
          (_acc, exam) => {
            const cloneAcc = clone(_acc);
            const lastIndex = cloneAcc.length - 1;

            if (exam.status === 'CANCELED') {
              cloneAcc.unshift([exam]);
              return cloneAcc;
            }

            cloneAcc[lastIndex].push(exam);

            if (exam.exam.isAttendance) {
              cloneAcc.push([]);
            }

            return cloneAcc;
          },
          [[]],
        );

      const examsWithAso = examsGroup.filter((exams) => exams.some((e) => e.exam.isAttendance) && exams.some((e) => e.sendEvent));

      const eventsJs = examsWithAso.map<IESocial2220.StructureReturn>((exams) => {
        const aso = exams[exams.length - 1];
        const historyExams = [];
        const id = generateId.newId();
        const doctorResponsible = company?.doctorResponsible;

        const isDoctorAvailable = doctorResponsible && doctorResponsible?.name && doctorResponsible?.councilId && doctorResponsible?.councilUF;

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
                  !!employee.examsHistory.filter((e) => e.status === 'DONE' && e?.exam?.esocial27Code === exam.exam.esocial27Code)[1] ||
                  (examsWithAso.length === 1 && aso.examType !== ExamHistoryTypeEnum.ADMI);
              }

              if (requiredObsProc.includes(esocial27Code)) {
                obsProc = exam.exam?.obsProc;
              }

              historyExams.push(exam);

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

        const receipt = aso?.events?.sort((b, a) => sortData(a, b))?.find((e) => e.receipt)?.receipt;

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
            ...(receipt && {
              indRetif: IndRetifEnum.MODIFIED,
              nrRecibo: receipt,
            }),
          },
        };

        return {
          id,
          event: event,
          eventDate: aso.doneDate,
          asoId: aso.id,
          aso: aso,
          historyExams,
          examIds: historyExams.map((i) => i.id),
          employee: employee,
        };
      });

      acc = [...eventsJs, ...acc];
      return acc;
    }, []);

    return eventsStruct;
  }

  convertToEvent3000Struct(props: IESocial3000.StructureEntry, options?: { ideEvento?: IEventProps['ideEvento'] }): IESocial3000.StructureReturn[] {
    const generateId = this.eSocialMethodsProvider.classGenerateId(props.cnpj);

    const events = props.event.map((event) => {
      const id = generateId.newId();
      const eventExclude: IEvent3000Props = {
        id,
        infoExclusao: {
          ideTrabalhador: { cpfTrab: event.cpf },
          tpEvento: mapTpEvent[event.eventType],
          nrRecEvt: event.receipt,
        },
        ideEmpregador: { nrInsc: props.cnpj },
        ideEvento: {
          tpAmb: options?.ideEvento?.tpAmb,
          procEmi: options?.ideEvento?.procEmi,
        },
      };

      return { ...event, event: eventExclude, id };
    });

    return events;
  }

  generateXmlEvent2220(event: IEvent2220Props, options?: { declarations?: boolean }) {
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

  generateXmlEvent3000(event: IEvent3000Props, options?: { declarations?: boolean }) {
    const baseEvent = this.generateEventBase(event);
    const infoExclusao = event?.infoExclusao;

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
        evtExclusao: {
          ['_attributes']: {
            Id: event.id,
          },
          ...baseEvent,
          infoExclusao: {
            tpExameOcup: { ['_text']: infoExclusao?.tpEvento },
            nrRecEvt: { ['_text']: infoExclusao?.nrRecEvt },
            ideTrabalhador: {
              cpfTrab: { ['_text']: infoExclusao.ideTrabalhador?.cpfTrab },
            },
          },
        },
      },
    };

    const xml = js2xml(eventJs, { compact: true });

    return xml;
  }

  private generateEventBase(event: IEventProps) {
    const eventJs = {
      ...(event?.ideEvento && {
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
      }),
      ideEmpregador: {
        tpInsc: {
          ['_text']: event.ideEmpregador.tpInsc || this.tpInsc,
        },
        nrInsc: {
          ['_text']: event.ideEmpregador.nrInsc,
        },
      },
      ...(event?.ideVinculo && {
        ideVinculo: {
          cpfTrab: {
            ['_text']: event.ideVinculo.cpfTrab,
          },
          matricula: {
            ['_text']: event.ideVinculo.matricula,
          },
        },
      }),
    };

    return eventJs;
  }

  private generateBatchXML(events: (IESocial2220.XmlReturn | IESocial3000.XmlReturn)[], event: IBatchProps) {
    const xmlEvents = events.map((event) => `<evento Id="${event.id}">${event.signedXml}</evento>`).join('');

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

    const xml = js2xml(eventJs, { compact: true }).replace(replaceText, xmlEvents).replace('<?xml version="1.0" encoding="UTF-8"?>', '');

    return xml;
  }

  private generateFetchBatchXML(protocolId: string) {
    const eventJs = {
      eSocial: {
        ['_attributes']: {
          xmlns: 'http://www.esocial.gov.br/schema/lote/eventos/envio/consulta/retornoProcessamento/v1_0_0',
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

  public async sendEventToESocial(events: (IESocial2220.XmlReturn | IESocial3000.XmlReturn)[], options: IESocialSendEventOptions) {
    // const eventChunks = arrayChunks(  Array.from({ length: 100 }).map(() => events[0]),  100,);
    const tpAmb = options?.environment || this.tpAmb;
    const eventChunks = arrayChunks(events, 40);

    const responseBatchEvents = await Promise.all(
      eventChunks.map(async (events) => {
        const batchXML = this.generateBatchXML(events, {
          eventGroup: 2,
          ideEmpregador: { nrInsc: options.company?.cnpj },
        });

        const client = tpAmb == TpAmbEnum.PROD ? this.clientProduction : this.clientRestrict;

        const sendEventBatch = new Promise<IEsocialSendBatchResponse>((resolve) => {
          client.ServicoEnviarLoteEventos.WsEnviarLoteEventos.EnviarLoteEventos(batchXML, (e, s) => {
            if (e)
              return resolve({
                status: {
                  cdResposta: '500',
                  descResposta: e?.message?.slice(0, 200) + '...',
                },
              });

            if (!s?.EnviarLoteEventosResult?.eSocial?.retornoEnvioLoteEventos)
              return resolve({
                status: {
                  cdResposta: '500',
                  descResposta: 'value of (s?.EnviarLoteEventosResult?.eSocial?.retornoEnvioLoteEventos) is undefined',
                },
              });

            resolve(s.EnviarLoteEventosResult.eSocial.retornoEnvioLoteEventos);
          });
        });

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

  public async sendExclusionToESocial(props: IESocial3000.SendEntry) {
    if (props.events.length === 0) return;

    const company = props.company;
    const cert = props.cert;
    const esocialSend = props.esocialSend;

    const excludeStruct = this.convertToEvent3000Struct({
      cnpj: company.cnpj,
      event: props.events.map((event) => {
        return {
          cpf: event.employee.cpf,
          eventType: event?.eventType,
          receipt: event?.receipt,
          employee: event.employee,
          aso: event.aso,
        };
      }),
    });

    const eventsExcludeXml: IESocial3000.XmlReturn[] = excludeStruct
      .map(({ event, ...data }) => {
        const errors = this.errorsEvent3000(event);
        if (errors.length > 0) return;

        const xmlResult = this.generateXmlEvent3000(event);
        const signedXml: string = esocialSend
          ? this.eSocialMethodsProvider.signEvent({
              xml: xmlResult,
              cert: cert,
            })
          : '';

        return { signedXml, xml: xmlResult, ...data };
      })
      .filter((i) => i);

    const sendEventResponse = esocialSend
      ? await this.sendEventToESocial(eventsExcludeXml, {
          company: company,
          environment: props.body?.tpAmb,
        })
      : [
          {
            events: eventsExcludeXml,
            response: {
              status: { cdResposta: '201' },
            } as IEsocialSendBatchResponse,
          },
        ];

    await this.saveDatabaseBatchEvent({
      esocialSend,
      company,
      body: props.body,
      type: props.type,
      user: props.user,
      sendEvents: sendEventResponse,
    });

    return eventsExcludeXml;
  }

  public async saveDatabaseBatchEvent(props: IBatchDatabaseSave) {
    const sendEvents = props.sendEvents;
    const companyId = props.company.id;
    const body = props.body;
    const esocialSend = props.esocialSend;
    const user = props.user;
    const type = props.type;

    // save on database
    await Promise.all(
      sendEvents.map(async (resp) => {
        const examsIds: number[] = [];

        const respEvents = resp.events;
        const isOk = ['201', '202'].includes(resp.response?.status?.cdResposta);

        const events: CreateESocialEvent[] = isOk
          ? respEvents.map(({ ...event }) => {
              if ('examIds' in event) {
                examsIds.push(...event.examIds);
              }

              let action: EmployeeESocialEventActionEnum = EmployeeESocialEventActionEnum.SEND;

              if (event.xml.includes('infoExclusao')) {
                action = EmployeeESocialEventActionEnum.EXCLUDE;
              }

              if (event.xml.includes('<indRetif>2</indRetif>')) {
                action = EmployeeESocialEventActionEnum.MODIFY;
              }

              return {
                employeeId: event.employee.id,
                ...('eventDate' in event && {
                  eventsDate: event?.eventDate,
                }),
                eventXml: event.xml,
                examHistoryId: event.aso.id,
                eventId: event.id,
                action,
              };
            })
          : [];

        await this.eSocialBatchRepository.create({
          companyId,
          environment: body?.tpAmb || 1,
          status: esocialSend ? (isOk ? StatusEnum.DONE : StatusEnum.INVALID) : StatusEnum.TRANSMITTED,
          type,
          userTransmissionId: user.userId,
          events,
          examsIds,
          protocolId: resp.response?.dadosRecepcaoLote?.protocoloEnvio,
          response: resp.response,
        });
      }),
    );
  }

  public async fetchEventToESocial(
    batch: EmployeeESocialBatchEntity,
    // options?: IESocialFetchEventOptions,
  ) {
    const protocolId = batch.protocolId || batch.response?.dadosRecepcaoLote?.protocoloEnvio;

    const XML = this.generateFetchBatchXML(protocolId);
    const tpAmb = batch.environment || this.tpAmb;

    const client = tpAmb == TpAmbEnum.PROD ? this.clientConsultProduction : this.clientConsultRestrict;

    const fetchEventBatch = new Promise<IEsocialFetchBatch.Response>((resolve) => {
      client.ServicoConsultarLoteEventos['Servicos.Empregador_ServicoConsultarLoteEventos'].ConsultarLoteEventos(XML, (e, s) => {
        if (e)
          return resolve({
            status: {
              cdResposta: '500',
              descResposta: e?.message?.slice(0, 200) + '...',
            },
          });

        if (!s?.ConsultarLoteEventosResult?.eSocial?.retornoProcessamentoLoteEventos)
          return resolve({
            status: {
              cdResposta: '500',
              descResposta: 'value of (s?.ConsultarLoteEventosResult?.eSocial?.retornoProcessamentoLoteEventos) is undefined',
            },
          });

        resolve(s.ConsultarLoteEventosResult.eSocial.retornoProcessamentoLoteEventos);
      });
    });

    const response = await fetchEventBatch;

    return { batch, response };
  }
}

export { ESocialEventProvider };
