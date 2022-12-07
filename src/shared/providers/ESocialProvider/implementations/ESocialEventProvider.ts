import { sortData } from './../../../utils/sorts/data.sort';
import { Inject, Injectable } from '@nestjs/common';
import { EmployeeESocialEventActionEnum, ExamHistoryTypeEnum, Prisma, StatusEnum } from '@prisma/client';
import clone from 'clone';
import { Client } from 'nestjs-soap';
import { IEvent3000Props } from '../../../../modules/esocial/interfaces/event-3000';
import { js2xml } from 'xml-js';
import deepEqual from 'deep-equal';

import { EmployeeEntity } from '../../../../modules/company/entities/employee.entity';
import { IEvent2220Props, mapResAso, mapTpExameOcup, requiredObsProc, requiredOrdExams } from '../../../../modules/esocial/interfaces/event-2220';
import { IEventProps, ProcEmiEnum, TpIncsEnum } from '../../../../modules/esocial/interfaces/event-batch';
import { PrismaService } from '../../../../prisma/prisma.service';
import { arrayChunks } from '../../../../shared/utils/arrayChunks';
import { DayJSProvider } from '../../DateProvider/implementations/DayJSProvider';
import { IBatchDatabaseSave, IESocial2220, IESocial2240, IESocial3000, IESocialSendEventOptions } from '../models/IESocialMethodProvider';
import { CompanyEntity } from './../../../../modules/company/entities/company.entity';
import { EmployeeExamsHistoryEntity } from './../../../../modules/company/entities/employee-exam-history.entity';
import { CreateESocialEvent } from './../../../../modules/esocial/dto/esocial-batch.dto';
import { EmployeeESocialBatchEntity } from './../../../../modules/esocial/entities/employeeEsocialBatch.entity';
import { IdeOCEnum, IEsocialFetchBatch, IEsocialSendBatchResponse } from './../../../../modules/esocial/interfaces/esocial';
import { mapTpEvent } from './../../../../modules/esocial/interfaces/event-3000';
import { EventGroupEnum, IBatchProps, IndRetifEnum, TpAmbEnum } from './../../../../modules/esocial/interfaces/event-batch';
import { ESocialBatchRepository } from './../../../../modules/esocial/repositories/implementations/ESocialBatchRepository';
import { SoapClientEnum } from './../../../constants/enum/soapClient';
import { sortNumber } from './../../../utils/sorts/number.sort';
import { ESocialMethodsProvider } from './ESocialMethodsProvider';
import {
  IEvent2240Props,
  IPriorRiskData,
  LocalAmbEnum,
  requiredDescAg,
  requiredLimTol,
  requiredTpAval,
  TpAvalEnum,
  TpInscEnum,
  UnMedEnum,
  utileEpiEpcEnum,
  YesNoEnum,
} from './../../../../modules/esocial/interfaces/event-2240';
import sortArray from 'sort-array';

@Injectable()
class ESocialEventProvider {
  private verProc = 'SimplesSST_1.0';
  private indRetif = IndRetifEnum.ORIGINAL;
  private tpAmb = TpAmbEnum.PROD;
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

  errorsEvent2240(event: IEvent2240Props) {
    if (!event) return [];
    const infoExpRisco = event.evtExpRisco.infoExpRisco;
    const respAmb = infoExpRisco.respReg;
    const infoAmb = infoExpRisco.infoAmb;
    const agNoc = infoExpRisco.agNoc;
    const ideVinculo = event.ideVinculo;

    const errors: { message: string }[] = [];

    {
      if (!ideVinculo.cpfTrab) errors.push({ message: 'Informar "CPF" do empregado' });
      if (!ideVinculo.matricula) errors.push({ message: 'Informar "matricula" do empregado' });
    }

    {
      if (respAmb.length == 0)
        errors.push({
          message: 'Informar o responsavél pelo monitoramento ambiental (PPP)',
        });

      respAmb.forEach((resp, index) => {
        if (!resp.cpfResp) {
          errors.push({
            message: `${index}: Informar o responsavél pelo monitoramento ambiental (PPP)`,
          });
        } else {
          if (!resp.ideOC || !resp.nrOC || !resp.ufOC)
            errors.push({
              message: `Profissional com CPF ${resp.cpfResp}: Informar o "CREA" do responsavél pelo monitoramento ambiental (PPP)`,
            });
        }
      });
    }

    {
      if (infoAmb.length == 0)
        errors.push({
          message: 'Informar o "local de trabalho (estbelecimento)" do cargp',
        });

      infoAmb.forEach((amb, index) => {
        if (!amb.dscSetor) {
          errors.push({
            message: `${index}: Informar o "Nome do setor" ao qual o cargo está inserido`,
          });
        }
        if (!amb.nrInsc) {
          errors.push({
            message: `${index}: Informar o "CNPJ" do estabelecimento (próprio ou de terceiros)`,
          });
        }
      });
    }

    {
      if (infoAmb.length == 0)
        errors.push({
          message: 'Informar o "local de trabalho (estbelecimento)" do cargp',
        });

      infoAmb.forEach((amb, index) => {
        if (!amb.dscSetor) {
          errors.push({
            message: `${index}: Informar o "Nome do setor" ao qual o cargo está inserido`,
          });
        }
        if (!amb.nrInsc) {
          errors.push({
            message: `${index}: Informar o "CNPJ" do estabelecimento (próprio ou de terceiros)`,
          });
        }
      });
    }

    {
      if (!infoExpRisco.dtIniCondicao)
        errors.push({
          message: 'Informar data de início de condição',
        });

      if (!infoExpRisco.infoAtiv.dscAtivDes)
        errors.push({
          message: 'Informar descrição de do cargo',
        });
    }
    {
      if (agNoc.length == 0) {
        errors.push({
          message: `Nenhum risco informado (utilizar "Ausência de risco" caso queira indicar essa condição)`,
        });
      }

      agNoc.forEach((ag) => {
        const code = ag.codAgNoc;

        if (!code) {
          errors.push({
            message: `${ag.nameAgNoc}: Informar código do eSocial`,
          });
        }

        const isEmptyRisk = requiredTpAval.includes(code);
        const isRequiredDesc = requiredDescAg.includes(code);
        const isRequiredLimit = requiredLimTol.includes(code);
        const isQuantity = ag?.tpAval === TpAvalEnum.QUANTITY;
        const epcEpi = ag?.epcEpi;
        const isEPCImplemented = epcEpi?.utilizEPC == utileEpiEpcEnum.IMPLEMENTED;
        const isEPIImplemented = epcEpi?.utilizEPI == utileEpiEpcEnum.IMPLEMENTED;

        if (isEmptyRisk && agNoc.length > 1) {
          errors.push({
            message: `Não é possivel informar "Ausência de risco", juntamente com outros riscos`,
          });
          return;
        }

        if (!isEmptyRisk && !ag.tpAval) {
          errors.push({
            message: `${ag.nameAgNoc} (${code || '-'}): Informar se é Quantitativo ou Qualitativo (erro do sistema)`,
          });
        }

        if (isRequiredDesc && !ag.dscAgNoc) {
          errors.push({
            message: `${ag.nameAgNoc} (${code || '-'}): Informar descrição complementar do agente nocivo (campo eSocial "dscAgNoc")`,
          });
        }

        if (isRequiredLimit && !ag.limTol) {
          errors.push({
            message: `${ag.nameAgNoc} (${code || '-'}): Informar "limite de tolerância"`,
          });
        }

        if (isQuantity) {
          if (!ag.intConc)
            errors.push({
              message: `${ag.nameAgNoc} (${code || '-'}): Informar "valor de medição" para risco quantitativo (campo eSocial "intConc")`,
            });

          if (!ag.unMed)
            errors.push({
              message: `${ag.nameAgNoc} (${code || '-'}): Informar "unidade de medida" do valor de medição (campo eSocial "unMed")`,
            });

          if (!ag.tecMedicao)
            errors.push({
              message: `${ag.nameAgNoc} (${code || '-'}): Informar "Tecnica de medição" (campo eSocial "tecMedicao")`,
            });
        }

        if (!isEmptyRisk) {
          if (!epcEpi.utilizEPC)
            errors.push({
              message: `${ag.nameAgNoc} (${code || '-'}): Informar EPC's ou se é "não aplicavel" ou "não implementado"`,
            });

          if (!epcEpi.utilizEPI)
            errors.push({
              message: `${ag.nameAgNoc} (${code || '-'}): Informar EPI's ou se é "não aplicavel" ou "não implementado"`,
            });

          if (isEPCImplemented && !epcEpi.eficEpc)
            errors.push({
              message: `${ag.nameAgNoc} (${code || '-'}): Informar eficácia do EPC`,
            });

          if (isEPIImplemented && !epcEpi.eficEpi)
            errors.push({
              message: `${ag.nameAgNoc} (${code || '-'}): Informar eficácia do EPI`,
            });

          if (isEPIImplemented && !epcEpi?.epi?.length)
            errors.push({
              message: `${ag.nameAgNoc} (${code || '-'}): Informar ca's do EPI's`,
            });
        }
      });
    }

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
        const { id } = generateId.newId();
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
              let isSequential: boolean | null = true;
              // let isSequential: boolean | null = null;
              let obsProc: string | null = null;
              const esocial27Code = exam.exam?.esocial27Code;

              // if (requiredOrdExams.includes(esocial27Code)) {
              //   isSequential =
              //     !!employee.examsHistory.filter((e) => e.status === 'DONE' && e?.exam?.esocial27Code === exam.exam.esocial27Code)[1] ||
              //     (examsWithAso.length === 1 && aso.examType !== ExamHistoryTypeEnum.ADMI);
              // }

              if (aso.examType == ExamHistoryTypeEnum.ADMI) isSequential = false;
              if (aso.examType == ExamHistoryTypeEnum.OFFI) isSequential = false;
              if (aso.examType == ExamHistoryTypeEnum.RETU) isSequential = false;

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

        const receipt = aso?.events?.sort((a, b) => sortData(b.created_at, a.created_at))?.find((e) => e.receipt)?.receipt;

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

  convertToEvent2240Struct(props: IESocial2240.StructureEntry, options?: { ideEvento?: IEventProps['ideEvento'] }) {
    const company = props.company;
    const employeesData = props.employees;
    const startDate = props.esocialStartDate;
    const generateId = this.eSocialMethodsProvider.classGenerateId(company.cnpj);
    const eventsStruct = employeesData.reduce<IESocial2240.StructureReturn[]>((acc, employee) => {
      const getEpcType = (risk: IPriorRiskData) => {
        const isEPCPresent = !!risk.riskData.engsToRiskFactorData.find((e) => e?.recMed?.medName == 'Não verificada');
        const isEPCNotApplicable = !!risk.riskData.engsToRiskFactorData.find((e) => e?.recMed?.medName == 'Não aplicável');
        const isEPCNotImplemented = !!risk.riskData.engsToRiskFactorData.find((e) => e?.recMed?.medName == 'Não implementada');

        if (isEPCNotApplicable) return utileEpiEpcEnum.NOT_APT;
        if (isEPCNotImplemented) return utileEpiEpcEnum.NOT_IMPLEMENTED;
        if (isEPCPresent) return utileEpiEpcEnum.IMPLEMENTED;
        return null;
      };

      const getEpiType = (risk: IPriorRiskData) => {
        const isEPINotApplicable = !!risk.riskData.epiToRiskFactorData.find((e) => e?.epi?.ca == '0');
        const isEPIPresent = !isEPINotApplicable && !!(risk.riskData.epiToRiskFactorData.length > 0);

        if (isEPINotApplicable) return utileEpiEpcEnum.NOT_APT;
        if (isEPIPresent) return utileEpiEpcEnum.IMPLEMENTED;
        return utileEpiEpcEnum.NOT_IMPLEMENTED;
      };

      const comparePPP = employee.pppHistory.reduce((acc, ppp) => {
        return { ...acc, [ppp.doneDate.toISOString()]: { ppp, excluded: true } };
      }, {} as Record<string, { ppp: typeof employee.pppHistory[0]; excluded?: boolean }>);

      let oldEventJs: IEvent2240Props['evtExpRisco'];

      const eventsJs = sortArray(employee.actualPPPHistory, { by: 'date', order: 'asc' }).map<IESocial2240.StructureReturn>((snapshot) => {
        const risks = snapshot.risks;
        const responsible = snapshot.responsible;
        const environments = snapshot.environments;
        const date = snapshot.date > startDate ? snapshot.date : startDate;
        const { id } = generateId.newId();

        const eventRisk: IEvent2240Props['evtExpRisco'] = {
          infoExpRisco: {
            dtIniCondicao: date,
            infoAmb: environments.map((e) => ({
              localAmb: e.isOwner ? LocalAmbEnum.OWNER : LocalAmbEnum.NOT_OWNER,
              dscSetor: e.sectorName,
              nrInsc: e.cnpj,
            })),
            infoAtiv: {
              dscAtivDes: snapshot.desc,
            },
            agNoc: risks
              .filter((risk) => {
                if (risks.length <= 1) return true;

                const riskFactor = risk?.riskFactor;
                const esocial = riskFactor?.esocial;
                const code = esocial?.id;
                const isEmptyRisk = requiredTpAval.includes(code);

                return !isEmptyRisk;
              })
              .map((risk) => {
                const riskFactor = risk?.riskFactor;
                const esocial = riskFactor?.esocial;
                const code = esocial?.id;
                const isEmptyRisk = requiredTpAval.includes(code);
                const isRequiredDesc = requiredDescAg.includes(code);
                const isRequiredLimit = requiredLimTol.includes(code);
                const isQuantity = esocial?.isQuantity;
                const limit = risk.riskData?.ibtugLEO || 100;
                const intensity = risk.riskData?.vdvrValue || risk.riskData?.arenValue || risk.riskData?.intensity;
                const useEpc = getEpcType(risk);
                const useEpi = getEpiType(risk);
                const isEPCEfficient = !!risk.riskData.engsToRiskFactorData.find((e) => e.efficientlyCheck);
                const isEPIEfficient = !!risk.riskData.epiToRiskFactorData.find((e) => e.efficientlyCheck);

                const isEPCImplemented = useEpc == utileEpiEpcEnum.IMPLEMENTED;
                const isEPIImplemented = useEpi == utileEpiEpcEnum.IMPLEMENTED;

                return {
                  nameAgNoc: riskFactor.name,
                  codAgNoc: code || undefined,
                  ...(isRequiredDesc && { dscAgNoc: riskFactor?.name }),
                  ...(!isEmptyRisk && { tpAval: isQuantity ? TpAvalEnum.QUANTITY : TpAvalEnum.QUALITY }),
                  ...(isQuantity && {
                    intConc: intensity,
                    ...(isRequiredLimit && { limTol: limit || undefined }),
                    unMed: UnMedEnum[riskFactor?.unit] || undefined,
                    tecMedicao: riskFactor?.method != 'Qualitativo' ? riskFactor?.method : undefined,
                  }),
                  ...(!isEmptyRisk && {
                    epcEpi: {
                      utilizEPC: getEpcType(risk) || undefined,
                      utilizEPI: getEpiType(risk) || undefined,
                      ...(isEPCImplemented && { eficEpc: isEPCEfficient ? YesNoEnum.YES : YesNoEnum.NO }),
                      ...(isEPIImplemented && { eficEpi: isEPIEfficient ? YesNoEnum.YES : YesNoEnum.NO }),
                      ...(isEPIImplemented && { epi: risk.riskData.epiToRiskFactorData.map((e) => ({ docAval: e?.epi?.ca || undefined })) }),
                      ...(isEPIImplemented && {
                        epiCompl: {
                          condFuncto: isEPIEfficient ? YesNoEnum.YES : YesNoEnum.NO,
                          higienizacao: isEPIEfficient ? YesNoEnum.YES : YesNoEnum.NO,
                          medProtecao: isEPIEfficient ? YesNoEnum.YES : YesNoEnum.NO,
                          periodicTroca: isEPIEfficient ? YesNoEnum.YES : YesNoEnum.NO,
                          przValid: isEPIEfficient ? YesNoEnum.YES : YesNoEnum.NO,
                          usoInint: isEPIEfficient ? YesNoEnum.YES : YesNoEnum.NO,
                        },
                      }),
                    },
                  }),
                };
              }),
            respReg: [
              {
                cpfResp: responsible?.cpf,
                ideOC: IdeOCEnum.CREA,
                nrOC: responsible?.councilId,
                ufOC: responsible?.councilUF,
              },
            ],
          },
        };

        const oldPPP = comparePPP[snapshot.date.toISOString()]?.ppp;

        let receipt = '';
        let isSame = false;

        if (oldPPP) {
          comparePPP[snapshot.date.toISOString()].excluded = false;
          eventRisk.infoExpRisco.dtIniCondicao;
          isSame = deepEqual(oldPPP?.json?.infoExpRisco, { ...eventRisk.infoExpRisco, dtIniCondicao: eventRisk.infoExpRisco.dtIniCondicao.toISOString() });
          receipt = oldPPP?.events?.sort((b, a) => sortData(a, b))?.find((e) => e.receipt)?.receipt;
        }

        if (oldEventJs && !isSame) {
          const oldRisks = oldEventJs?.infoExpRisco;
          isSame = deepEqual(
            { ...oldRisks.agNoc, ...oldRisks.infoAmb, ...oldRisks.infoAtiv, ...oldRisks.respReg },
            {
              ...eventRisk.infoExpRisco.agNoc,
              ...eventRisk.infoExpRisco.infoAmb,
              ...eventRisk.infoExpRisco.infoAtiv,
              ...eventRisk.infoExpRisco.respReg,
            },
          );
        }

        const event: IEvent2240Props = {
          id,
          evtExpRisco: eventRisk,
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

        delete employee.pppHistory;
        delete employee.actualPPPHistory;

        oldEventJs = event.evtExpRisco;

        return {
          id,
          event: event,
          employee: employee,
          eventDate: date,
          json: event.evtExpRisco,
          isSame,
          ...(receipt && {
            receipt,
            ppp: oldPPP,
          }),
        };
      });

      const excludedEvents = Object.values(comparePPP)
        .filter((compare) => compare.excluded)
        .map((compare) => {
          const receipt = compare.ppp?.events?.sort((b, a) => sortData(a, b))?.find((e) => e.receipt)?.receipt;
          if (!receipt) return;
          return {
            id: '',
            event: null,
            employee: employee,
            eventDate: compare.ppp.doneDate,
            isExclude: true,
            receipt,
            ppp: compare.ppp,
          };
        })
        .filter((i) => i);

      acc = [...eventsJs, ...acc, ...excludedEvents];
      return acc;
    }, []);

    return eventsStruct;
  }

  convertToEvent3000Struct(props: IESocial3000.StructureEntry, options?: { ideEvento?: IEventProps['ideEvento'] }): IESocial3000.StructureReturn[] {
    const generateId = this.eSocialMethodsProvider.classGenerateId(props.cnpj);

    const events = props.event.map((event) => {
      const { id } = generateId.newId();
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
                ...(exam.ordExame && { ordExame: { ['_text']: exam.ordExame } }),
                ...(exam.obsProc && { obsProc: { ['_text']: exam.obsProc } }),
                ...(exam.indResult && { indResult: { ['_text']: exam.indResult } }),
              })),
              medico: {
                nmMed: { ['_text']: asoDoctor.nmMed },
                nrCRM: { ['_text']: asoDoctor.nrCRM },
                ufCRM: { ['_text']: asoDoctor.ufCRM },
              },
            },
            respMonit: {
              // ...(respMonit.cpfResp && { cpfResp: { ['_text']: respMonit.cpfResp } }),
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

  generateXmlEvent2240(event: IEvent2240Props, options?: { declarations?: boolean }) {
    if (!event) return '';
    const baseEvent = this.generateEventBase(event);
    const infoExpRisco = event.evtExpRisco.infoExpRisco;
    const respReg = infoExpRisco.respReg;
    const dscAtivDes = infoExpRisco.infoAtiv.dscAtivDes;
    const infoAmb = infoExpRisco.infoAmb;
    const agNoc = infoExpRisco.agNoc;

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
          xmlns: 'http://www.esocial.gov.br/schema/evt/evtExpRisco/v_S_01_00_00',
        },
        evtExpRisco: {
          ['_attributes']: {
            Id: event.id,
          },
          ...baseEvent,
          infoExpRisco: {
            dtIniCondicao: { ['_text']: this.convertDate(infoExpRisco.dtIniCondicao) },
            infoAmb: infoAmb.map((amb) => ({
              localAmb: { ['_text']: amb.localAmb },
              dscSetor: { ['_text']: amb.dscSetor },
              tpInsc: { ['_text']: TpInscEnum.CNPJ },
              nrInsc: { ['_text']: amb.nrInsc },
            })),
            infoAtiv: {
              dscAtivDes: { ['_text']: dscAtivDes },
            },
            agNoc: agNoc.map((ag) => {
              const code = ag.codAgNoc;
              const isEmptyRisk = requiredTpAval.includes(code);
              const isRequiredDesc = requiredDescAg.includes(code);
              const isRequiredLimit = requiredLimTol.includes(code);
              const isQuantity = ag?.tpAval === TpAvalEnum.QUANTITY;
              const epcEpi = ag?.epcEpi;

              const isEPCImplemented = epcEpi?.utilizEPC == utileEpiEpcEnum.IMPLEMENTED;
              const isEPIImplemented = epcEpi?.utilizEPI == utileEpiEpcEnum.IMPLEMENTED;

              return {
                codAgNoc: code || undefined,
                ...(isRequiredDesc && { dscAgNoc: { ['_text']: ag.dscAgNoc } }),
                ...(!isEmptyRisk && { tpAval: { ['_text']: ag.tpAval } }),
                ...(isQuantity && {
                  intConc: { ['_text']: ag.intConc },
                  ...(isRequiredLimit && { limTol: { ['_text']: ag.limTol } }),
                  unMed: { ['_text']: ag.unMed },
                  tecMedicao: { ['_text']: ag.tecMedicao },
                }),
                ...(!isEmptyRisk && {
                  epcEpi: {
                    utilizEPC: { ['_text']: epcEpi?.utilizEPC },
                    utilizEPI: { ['_text']: epcEpi?.utilizEPI },
                    ...(isEPCImplemented && { eficEpc: { ['_text']: epcEpi?.eficEpc } }),
                    ...(isEPIImplemented && { eficEpi: { ['_text']: epcEpi?.eficEpi } }),
                    ...(isEPIImplemented && { epi: epcEpi?.epi.map((e) => ({ docAval: { ['_text']: e.docAval } })) }),
                    ...(isEPIImplemented && {
                      epiCompl: {
                        medProtecao: { ['_text']: epcEpi.epiCompl.medProtecao },
                        condFuncto: { ['_text']: epcEpi.epiCompl.condFuncto },
                        usoInint: { ['_text']: epcEpi.epiCompl.usoInint },
                        przValid: { ['_text']: epcEpi.epiCompl.przValid },
                        periodicTroca: { ['_text']: epcEpi.epiCompl.periodicTroca },
                        higienizacao: { ['_text']: epcEpi.epiCompl.higienizacao },
                      },
                    }),
                  },
                }),
              };
            }),
            respReg: respReg.map((resp) => ({
              cpfResp: { ['_text']: resp.cpfResp },
              ideOC: { ['_text']: resp.ideOC },
              ...(resp.dscOC && { dscOC: { ['_text']: resp.dscOC } }),
              nrOC: { ['_text']: resp.nrOC },
              ufOC: { ['_text']: resp.ufOC },
            })),
          },
        },
      },
    };

    const xml = js2xml(eventJs, { compact: true });

    return xml;
  }

  generateXmlEvent3000(event: IEvent3000Props, options?: { declarations?: boolean }) {
    const baseEvent = this.generateEventBase(event, { isExclude: true });
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
          xmlns: 'http://www.esocial.gov.br/schema/evt/evtExclusao/v_S_01_00_00',
        },
        evtExclusao: {
          ['_attributes']: {
            Id: event.id,
          },
          ...baseEvent,
          infoExclusao: {
            tpEvento: { ['_text']: infoExclusao?.tpEvento },
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

  private generateEventBase(event: IEventProps, options?: { isExclude?: boolean }) {
    const eventJs = {
      ...(event?.ideEvento && {
        ideEvento: {
          ...(!options?.isExclude && {
            indRetif: {
              ['_text']: event.ideEvento.indRetif || this.indRetif,
            },
          }),
          ...(!options?.isExclude &&
            event.ideEvento.nrRecibo && {
              nrRecibo: {
                ['_text']: event.ideEvento.nrRecibo,
              },
            }),
          tpAmb: {
            ['_text']: event.ideEvento.tpAmb || this.tpAmb,
          },
          procEmi: {
            ['_text']: event.ideEvento.procEmi || this.procEmi,
          },
          verProc: {
            ['_text']: this.verProc,
          },
        },
      }),
      ideEmpregador: {
        tpInsc: {
          ['_text']: event.ideEmpregador.tpInsc || this.tpInsc,
        },
        nrInsc: {
          ['_text']: event.ideEmpregador.nrInsc.slice(0, 8),
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

  private generateBatchXML(events: (IESocial2220.XmlReturn | IESocial3000.XmlReturn | IESocial2240.XmlReturn)[], event: IBatchProps) {
    const xmlEvents = events.map((event) => `<evento Id="${event?.idFull || event.id}">${event.signedXml}</evento>`).join('');

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
              ['_text']: event.ideEmpregador.nrInsc.slice(0, 8),
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

  private onGetDate = (date: Date | null | number) => {
    // return date ? new Date(date) : null;
    if (typeof date === 'number') return this.dayJSProvider.dayjs(date).startOf('day').toDate();
    return date ? this.dayJSProvider.dayjs(date).startOf('day').toDate() : null;
  };

  public async sendEventToESocial(events: (IESocial2220.XmlReturn | IESocial3000.XmlReturn | IESocial2240.XmlReturn)[], options: IESocialSendEventOptions) {
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
          ppp: event.ppp,
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
        const pppJson: { json: any; event: typeof resp.events[0] }[] = [];

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

              if ('json' in event) {
                if (action != EmployeeESocialEventActionEnum.EXCLUDE) pppJson.push({ json: event.json, event });
              }

              return {
                employeeId: event.employee.id,
                eventXml: event.xml,
                eventId: event.idFull || event.id,
                action,
                ...('eventDate' in event && {
                  eventsDate: event?.eventDate,
                }),
                ...('aso' in event && {
                  examHistoryId: event?.aso?.id,
                }),
                ...('ppp' in event && {
                  pppId: event?.ppp?.id,
                }),
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
          pppJson,
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
