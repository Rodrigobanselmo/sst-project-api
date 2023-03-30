import { checkRiskDataDoc } from './../../../../../shared/utils/getRiskDoc';
import { isNaEpi, isNaRecMed } from './../../../../../shared/utils/isNa';
import { GenerateSourceEntity } from './../../../../sst/entities/generateSource.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { EngsRiskDataEntity } from '../../../../../modules/sst/entities/engsRiskData.entity';
import { RecMedEntity } from '../../../../../modules/sst/entities/recMed.entity';

import { EpiRiskDataEntity } from '../../../../../modules/sst/entities/epiRiskData.entity';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { IPriorRiskData, onGetRisks } from '../../../../../shared/utils/onGetRisks';
import { removeDuplicate } from '../../../../../shared/utils/removeDuplicate';
import { HierarchyEntity } from '../../../../company/entities/hierarchy.entity';
import { FindAllRiskDataByEmployeeService } from '../../../../sst/services/risk-data/find-by-employee/find-by-employee.service';
import { EmployeeRepository } from './../../../../company/repositories/implementations/EmployeeRepository';
import { IPdfOSData } from './types/IOSData.type';

@Injectable()
export class PdfOsDataService {
  constructor(private readonly employeeRepository: EmployeeRepository, private readonly findAllRiskDataByEmployeeService: FindAllRiskDataByEmployeeService) {}

  async execute(employeeId: number, userPayloadDto: UserPayloadDto): Promise<IPdfOSData> {
    const companyId = userPayloadDto.targetCompanyId;

    const employeeFound = await this.employeeRepository.findFirstNude({
      where: {
        id: employeeId,
        OR: [
          {
            companyId,
          },
          {
            company: {
              receivingServiceContracts: {
                some: { applyingServiceCompanyId: companyId },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        companyId: true,
        name: true,
        hierarchy: { select: { workspaces: { select: { name: true } } } },
        cpf: true,
        esocialCode: true,
        // birthday: true,
        // sex: true,
        company: {
          select: {
            name: true,
            initials: true,
            logoUrl: true,
            fantasy: true,
            os: true,
            cnpj: true,
            group: { select: { companyGroup: { select: { os: true } } } },
            workspace: { select: { id: true } },
            receivingServiceContracts: {
              select: {
                applyingServiceCompany: {
                  select: {
                    initials: true,
                    id: true,
                    name: true,
                    cnpj: true,
                    os: true,
                    logoUrl: true,
                    fantasy: true,
                  },
                },
              },
              where: {
                applyingServiceCompany: {
                  isConsulting: true,
                  isGroup: false,
                  license: { status: 'ACTIVE' },
                },
              },
            },
          },
        },
      },
    });

    const workspaces = employeeFound?.hierarchy?.workspaces;
    delete employeeFound.hierarchy;

    if (!employeeFound?.id) throw new ForbiddenException(ErrorMessageEnum.FORBIDDEN_ACCESS);

    const { risk: riskData, employee: employeeRisk } = await this.findAllRiskDataByEmployeeService.getRiskData(employeeId, undefined, {
      fromExam: true,
      hierarchyData: true,
      filterDate: true,
      selectAdm: true,
      selectEpi: true,
      selectEpc: true,
      selectFont: true,
      desc: true,
    });

    const employee = { ...employeeRisk, ...employeeFound };
    const osRiskData = checkRiskDataDoc(riskData, { docType: 'isPGR', companyId: employee.companyId });
    const osRisk = onGetRisks(osRiskData);

    const epiEpc = this.onGetAllEpiEpcData(osRisk);

    const consultantCompany = employee?.company?.receivingServiceContracts?.[0]?.applyingServiceCompany;
    const actualCompany = employee.company;
    const sector = this.onGetSector(employee?.hierarchy);
    const os = actualCompany.os || consultantCompany.os;

    delete actualCompany?.receivingServiceContracts;
    delete actualCompany?.os;
    delete consultantCompany?.os;
    delete employee?.company;

    return {
      consultantCompany,
      os,
      actualCompany,
      employee,
      risks: osRisk.map((risk) => ({ riskData: risk.riskData[0], riskFactor: risk.riskFactor })),
      sector,
      workspaces,
      ...epiEpc,
    };
  }

  onGetAllEpiEpcData(osRisk: IPriorRiskData[]) {
    const epis: EpiRiskDataEntity[] = [];
    const epcs: EngsRiskDataEntity[] = [];
    const adms: RecMedEntity[] = [];
    const font: Record<string, GenerateSourceEntity[]> = {};

    //! should get all riskData epis and exams on other aso?
    osRisk?.forEach((data) => {
      data?.riskData
        ?.filter((rd) => rd?.prioritization == data.riskData[0]?.prioritization)
        ?.forEach((rd) => {
          rd.engsToRiskFactorData.forEach((e) => {
            epcs.push(e);
          });

          rd.epiToRiskFactorData.forEach((e) => {
            epis.push(e);
          });

          rd.adms.forEach((e) => {
            adms.push(e);
          });

          if (!font[rd.riskId]) font[rd.riskId] = [];
          font[rd.riskId].push(...rd.generateSources);
        });
    });

    Object.keys(font).forEach((key) => {
      font[key] = removeDuplicate(font[key], { removeById: 'id' });
    });

    return {
      epis: removeDuplicate(epis, { removeById: 'epiId' }).filter((e) => !isNaEpi(e.epi.ca)),
      epcs: removeDuplicate(epcs, { removeById: 'recMedId' }).filter((e) => !isNaRecMed(e.recMed.medName)),
      adms: removeDuplicate(adms, { removeById: 'id' }).filter((e) => !isNaRecMed(e.medName)),
      font,
    };
  }

  onGetSector(hierarchy: Partial<HierarchyEntity>) {
    return hierarchy?.parents?.find((parent) => parent.type == 'SECTOR');
    // this.hierarchyRepository.findFirstNude({where:{type:'SECTOR', children:{some:{}}}})
  }
}

//  med: [
//         'Realização de exames médicos e controle através do PCMSO com orientações sobre riscos à saúde; Utilização obrigatória dos EPI s recomendados para a função Avaliação e controle dos riscos existentes no processo produtivo por meio do PPRA; Treinamentos obrigatórios para a função e proibição do acesso de menores às câmaras frias.',
//       ],
//       rec: [
//         'Atenção na realização de atividades quando o piso estiver molhado, sempre avise os seus colegas que está realizando a limpeza do piso, colocando as placas de sinalização de “piso molhado”. Comunique o gerente de unidade de negócios ou a CIPA sobre qualquer irregularidade que possa colocar você ou seus companheiros em risco de acidentes. Não remova ou ultrapasse as proteções existentes na área. Use todos os EPIs designados à sua função. Compareça na clínica de medicina ocupacional para realizar os exames periódicos sempre que solicitado.',
//       ],
//       obligations: [
//         `  Não trabalhar sem os equipamentos de proteção individuais, recomendados para a sua atividade; A prática de segurança deve fazer parte de sua rotina diária; comunique ao seu superior imediato as condições de risco identificadas que possam gerar acidentes.
//   Possíveis Sanções aplicáveis: Advertência verbal; Advertência escrita; Suspensão e Demissão por “justa causa”.
// `,
//       ],
//       prohibitions: [
//         'É proibido realizar qualquer operação na falta de qualquer EPI acima relacionado;',
//         'É proibido realizar qualquer operação na ocorrência de condição anormal de trabalho;',
//         'É proibido realizar qualquer operação utilizando anéis, pulseiras, relógios ou outros adornos pessoais;',
//         'É proibido correr nos deslocamentos internos, deslocar-se caminhando normalmente;',
//         'É proibido acessar as câmaras frias (resfriados e de congelados);',
//         'É proibido fazer a diluição de produtos químicos concentrados;',
//         'É proibido fazer recebimento de materiais e/ou transporte de cargas;',
//         'É proibido fazer a limpeza de pista drive utilizando produtos químicos e equipamentos de alta pressão (lava jato);',
//         'É proibido trabalhar em horários noturnos (Das 22:00hs às 06:00hs);',
//         'É proibido realizar a limpeza dos banheiros;',
//         'É proibido utilizar o fatiador de tomates.',
//       ],
//       procedures: [
//         'Atender prontamente as solicitações de encaminhamento médico para atendimento do acidente, após a ocorrência de um acidente;',
//         'Comunicar IMEDIATAMENTE o acidente ao Gerente de Unidade de Negócios, administrativa ou cipeiro, fornecendo TODAS as informações relativas ao acidente;',
//         'Comunicar IMEDIATAMENTE o acidente ao setor de Saúde e Segurança do Trabalho da Regional;',
//         'Prestar primeiros socorros ao acidentado SOMENTE se for apto (treinado e certificado) para este procedimento;',
//       ],
//       cipa: [
//         'Participar do processo eleitoral para nova gestão;',
//         'Participar efetivamente do curso de formação de cipeiros e das reuniões mensais da CIPA;',
//         'Indicar à CIPA, ao SESMT e aos gerentes de restaurantes situações de riscos e apresentar as sugestões para correção das condições de trabalho;',
//         'Divulgar a todos os funcionários de restaurantes as informações relativas à promoção da saúde e preservação da integridade física de todos os funcionários;',
//         'Participar da investigação dos acidentes de trabalho e solicitar cópias das CAT’s;',
//         'Promover anualmente a SIPAT - Semana Interna de Prevenção de Acidentes de Trabalho;',
//       ],
//       declaration: [
//         `   DECLARO ter recebido informações, orientações e uma cópia desta Ordem de Serviço, em duas páginas, para permitir a execução de trabalho seguro desta função.
//    DECLARO também estar ciente de que a não obediência às normas estabelecidas neste DOCUMENTO, poderá sujeitar-me às penalidades disciplinares definidas no regulamento interno da empresa, mencionadas acima, e dispositivos legais aplicáveis.
// `,
//       ],
