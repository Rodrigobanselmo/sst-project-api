import { sortNumber } from './../../../../../../shared/utils/sorts/number.sort';
import { originRiskMap } from './../../../../../../shared/constants/maps/origin-risk';
import { EmployeePPPHistoryEntity } from './../../../../../company/entities/employee-ppp-history.entity';
import { EmployeeEntity } from './../../../../../company/entities/employee.entity';
import { CompanyEntity } from './../../../../../company/entities/company.entity';
import { checkRiskDataDoc } from './../../../../../documents/services/pgr/document/upload-pgr-doc.service';
import { HierarchyEntity } from './../../../../../company/entities/hierarchy.entity';
import { IHierarchyMap } from './../../../../../documents/docx/converter/hierarchy.converter';
import { RiskFactorDataEntity } from './../../../../../sst/entities/riskData.entity';
import { RiskRepository } from './../../../../../sst/repositories/implementations/RiskRepository';
import { Injectable } from '@nestjs/common';
import clone from 'clone';

import { ESocialSendEnum } from '../../../../../../shared/constants/enum/esocial';
import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { FindEvents2240Dto } from '../../../../dto/event.dto';
import {
  mapInverseResAso,
  mapInverseTpExameOcup,
} from '../../../../interfaces/event-2220';
import {
  HierarchyOnHomogeneousEntity,
  HomoGroupEntity,
} from '../../../../../company/entities/homoGroup.entity';
import { HierarchyEnum, HomogeneousGroup } from '@prisma/client';
import { RiskFactorsEntity } from '../../../../../../modules/sst/entities/risk.entity';
import { DayJSProvider } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class FindEvents2240ESocialService {
  constructor(
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly riskRepository: RiskRepository,
    private readonly dayjsProvider: DayJSProvider,
  ) {}

  async execute(
    { skip, take, ...query }: FindEvents2240Dto,
    user: UserPayloadDto,
  ) {
    const companyId = user.targetCompanyId;
    const { company } = await this.eSocialMethodsProvider.getCompany(companyId);

    const startDate = company.esocialStart;
    const esocialSend = company.esocialSend;
    if (!startDate || esocialSend === null)
      return {
        data: [],
        count: 0,
        error: {
          message:
            'Data de início do eSocial ou tipo de envio não informado para essa empresa',
        },
      };

    const companyFound = await this.getCompany(companyId);
    const homogeneousTree = await this.getHomoTree(companyFound);
    const riskDataTree = await this.getRiskData(companyFound, homogeneousTree);
    const hierarchyTree = await this.getHierarchyTree(
      companyFound,
      riskDataTree,
    );

    const employeeTree = {} as Record<
      string,
      EmployeeEntity & { actualPPPHistory?: EmployeePPPHistoryEntity[] }
    >;
    companyFound.employees.forEach((employee) => {
      const riskTimelineTree = {};

      employee.hierarchyHistory.forEach((history, index) => {
        const startDate = new Date(history.startDate);
        const endDate = employee.hierarchyHistory[index + 1]
          ? new Date(employee.hierarchyHistory[index + 1].startDate)
          : null;

        riskTimelineTree[this.dayjsProvider.format(startDate, 'YYYYMMDD')] = {};
        if (endDate)
          riskTimelineTree[this.dayjsProvider.format(endDate, 'YYYYMMDD')] = {};

        const hierarchyIds = [
          history.hierarchyId,
          ...history.subHierarchies.map((i) => i.id),
        ];

        const hierarchyOnHomogeneous = hierarchyIds
          .map((id) => hierarchyTree[id].hierarchyOnHomogeneous)
          .reduce((acc, curr) => {
            return [...acc, ...curr];
          }, []);

        // hierarchyOnHomogeneous.

        //
        (history as any).hierarchyOnHomogeneous = '';
        return history;
      });

      employeeTree[employee.id] = {
        ...employee,
        actualPPPHistory: [],
      };
    });

    // let type: ESocialSendEnum = ESocialSendEnum.SEND;
    // if (
    //   data.aso?.events?.some((e) =>
    //     ['DONE', 'TRANSMITTED'].includes(e.status),
    //   )
    // ) {
    //   const isExclude = data.aso.status === 'CANCELED';
    //   if (isExclude) type = ESocialSendEnum.EXCLUDE;
    //   if (!isExclude) type = ESocialSendEnum.MODIFIED;
    // }

    //  return {
    //     company,
    //     doneDate: data.event.exMedOcup.aso.dtAso,
    //     examType: mapInverseResAso[data.event.exMedOcup?.tpExameOcup],
    //     evaluationType: mapInverseTpExameOcup[data.event.exMedOcup.aso?.resAso],
    //     errors: eventErrors,
    //     employee: data.employee,
    //     type,
    //     xml: xmlResult,
    //   }[];

    return employeeTree;

    // return riskDataReturn.map((riskData) => new RiskFactorDataEntity(riskData));

    // const employees = await this.employeeRepository.findNude({
    //   where: {
    //     companyId,
    //     OR: [
    //       { pppHistory: { none: { id: { gt: 0 } } } },
    //       { pppHistory: { some: { sendEvent: true } } },
    //     ],
    //   },
    //   select: {
    //     id: true,
    //     cpf: true,
    //     pppHistory: true,
    //     esocialCode: true,
    //     hierarchyHistory: {
    //       select: {
    //         id: true,
    //         startDate: true,
    //         subHierarchies: { select: { id: true } },
    //       },
    //     },
    //   },
    // });

    // check hierarchy ppp risks if
    // -> risk data has been added / edited
    // -> risk data info has been edited
    // -> GHO has been edited (endDate / hierarchies) (add does not matter because will need to add risk inside to make the difference)
    // ->
    // ->

    // check employee ppp risks if
    // -> hierarchy has been added / edited
    // ->
    // ->

    // return riskDataReturn.map((riskData) => new RiskFactorDataEntity(riskData));

    return;

    const { data: employees3, count } =
      await this.employeeRepository.findEvent2220(
        {
          startDate,
          companyId,
          ...query,
        },
        { take: 1000 },
        { select: { name: true } },
      );

    const eventsStruct = this.eSocialEventProvider.convertToEvent2220Struct(
      company,
      employees3,
    );

    const eventsXml = eventsStruct.map((data) => {
      const eventErrors = this.eSocialEventProvider.errorsEvent2220(data.event);
      const xmlResult = this.eSocialEventProvider.generateXmlEvent2220(
        data.event,
        // { declarations: true },
      );

      const company = data.employee?.company;
      delete data.employee?.company;

      let type: ESocialSendEnum = ESocialSendEnum.SEND;
      if (
        data.aso?.events?.some((e) =>
          ['DONE', 'TRANSMITTED'].includes(e.status),
        )
      ) {
        const isExclude = data.aso.status === 'CANCELED';
        if (isExclude) type = ESocialSendEnum.EXCLUDE;
        if (!isExclude) type = ESocialSendEnum.MODIFIED;
      }

      return {
        company,
        doneDate: data.event.exMedOcup.aso.dtAso,
        examType: mapInverseResAso[data.event.exMedOcup?.tpExameOcup],
        evaluationType: mapInverseTpExameOcup[data.event.exMedOcup.aso?.resAso],
        errors: eventErrors,
        employee: data.employee,
        type,
        xml: xmlResult,
      };
    });

    return { data: eventsXml, count };
  }

  async getRiskData(
    company: CompanyEntity,
    homoTree: Record<string, HomogeneousGroup>,
  ) {
    const companyId = company.id;

    const risks = await this.riskRepository.findNude({
      where: {
        representAll: false, // remove standard risk
        riskFactorData: { some: { companyId } },
      },
      select: {
        name: true,
        severity: true,
        type: true,
        representAll: true,
        id: true,
        isPPP: true,
        docInfo: {
          where: {
            AND: [
              {
                OR: [
                  { companyId },
                  {
                    company: {
                      applyingServiceContracts: {
                        some: { receivingServiceCompanyId: companyId },
                      },
                    },
                  },
                ],
              },
            ],
          },
          select: { isPPP: true, hierarchyId: true, riskId: true },
        },
        riskFactorData: {
          where: {
            companyId,
          },
          select: {
            endDate: true,
            startDate: true,
            homogeneousGroupId: true,
            id: true,
            level: true,
            riskId: true,
            json: true,
          },
        },
      },
    });

    const riskDataAll: RiskFactorDataEntity[] = [];

    risks.forEach((risk) => {
      risk.riskFactorData.forEach((_riskData) => {
        const riskCopy = clone(risk);
        riskCopy.riskFactorData = undefined;

        if (!homoTree[_riskData.homogeneousGroupId])
          _riskData.prioritization = 0;
        else _riskData.prioritization = 3;

        _riskData.riskFactor = riskCopy;
        riskDataAll.push(_riskData);
      });
    });

    const riskData = checkRiskDataDoc(riskDataAll, {
      docType: 'isPPP',
      companyId,
    });

    const riskDataTree = {} as Record<string, RiskFactorDataEntity[]>;
    riskData.forEach((rd) => {
      if (!riskDataTree[rd.homogeneousGroupId])
        riskDataTree[rd.homogeneousGroupId] = [];

      riskDataTree[rd.homogeneousGroupId].push(rd);
    });

    return riskDataTree;
  }

  async getRisks(company: CompanyEntity) {
    const companyId = company.id;

    const risksFound = await this.riskRepository.findNude({
      where: {
        representAll: false, // remove standard risk
        riskFactorData: { some: { companyId } },
      },
      select: {
        name: true,
        severity: true,
        type: true,
        representAll: true,
        id: true,
        isPPP: true,
        docInfo: {
          where: {
            AND: [
              {
                OR: [
                  { companyId },
                  {
                    company: {
                      applyingServiceContracts: {
                        some: { receivingServiceCompanyId: companyId },
                      },
                    },
                  },
                ],
              },
            ],
          },
          select: { isPPP: true, hierarchyId: true, riskId: true },
        },
        riskFactorData: {
          where: {
            companyId,
          },
          select: {
            endDate: true,
            startDate: true,
            homogeneousGroupId: true,
            id: true,
            level: true,
            riskId: true,
            json: true,
          },
        },
      },
    });

    const riskDataAll: RiskFactorDataEntity[] = [];

    const risks = risksFound.map((risk) => {
      risk.riskFactorData = checkRiskDataDoc(risk.riskFactorData, {
        docType: 'isPPP',
        companyId,
      });

      return risk;
    });

    return risks;
  }

  async getHomoTree(company: CompanyEntity) {
    const homoTree = {} as Record<string, HomogeneousGroup>;
    company.homogeneousGroup.forEach((homo) => {
      homoTree[homo.id] = homo;
    });

    return homoTree;
  }

  async getHierarchyTree(
    company: CompanyEntity,
    riskDataTree: Record<string, RiskFactorDataEntity[]>,
  ) {
    const hierarchyTree = {} as Record<string, HierarchyEntity>;
    company.hierarchy.forEach((hierarchy) => {
      const prioritization = originRiskMap[hierarchy.type]?.prioritization;

      hierarchyTree[hierarchy.id] = {
        hierarchyOnHomogeneous: hierarchy.hierarchyOnHomogeneous.map(
          (hierOnHomo) => {
            hierOnHomo.homogeneousGroup = {
              riskFactorData:
                riskDataTree?.[hierOnHomo.homogeneousGroupId]?.map((rd) => {
                  if (prioritization && !rd.prioritization)
                    rd.prioritization = prioritization;
                  return rd;
                }) || [],
            } as HomoGroupEntity;

            return hierOnHomo;
          },
        ),
        ...hierarchy,
      };
    });

    const hierarchies = company.hierarchy
      .map((h) => {
        const isOffice = h.type === HierarchyEnum.OFFICE;
        const isSubOffice = h.type === HierarchyEnum.SUB_OFFICE;

        if (!isOffice && !isSubOffice) return;

        const hierOnHomo: HierarchyOnHomogeneousEntity[] = [
          ...h.hierarchyOnHomogeneous,
        ];

        if (isOffice) {
          function loop(parent?: HierarchyEntity) {
            if (parent) {
              hierOnHomo.push(...parent.hierarchyOnHomogeneous);
              const nextParent = hierarchyTree[parent.parentId];
              loop(nextParent);
            }
          }

          const parent = hierarchyTree[h.parentId];
          loop(parent);
        }

        h.hierarchyOnHomogeneous = hierOnHomo;

        // const riskFactorData = hierOnHomo.reduce((acc, homo) => {
        //   acc = [...acc, ...homo.homogeneousGroup.riskFactorData];
        //   return acc;
        // }, [] as RiskFactorDataEntity[]);

        return h;
      })
      .filter((i) => i);

    const hierarchiesTree = {} as Record<string, HierarchyEntity>;
    hierarchies.forEach((rd) => {
      hierarchiesTree[rd.id] = rd;
    });

    return hierarchiesTree;
  }

  async getCompany(companyId: string) {
    const company = await this.companyRepository.findFirstNude({
      where: { id: companyId },
      select: {
        id: true,
        esocialStart: true,
        esocialSend: true,
        cnpj: true,
        // doctorResponsible: {
        //   include: { professional: { select: { name: true, cpf: true } } },
        // },
        // cert: !!options?.cert,
        // ...(!!options?.report && {
        //   report: true,
        // }),
        // ...(!!options?.cert && {
        //   receivingServiceContracts: {
        //     select: {
        //       applyingServiceCompany: {
        //         select: { cert: true },
        //       },
        //     },
        //   },
        // }),

        //* company group
        group: {
          select: {
            // doctorResponsible: {
            //   include: { professional: { select: { name: true, cpf: true } } },
            // },
            esocialStart: true,
            // ...(!!options?.cert && {
            //   company: { select: { cert: true } },
            // }),
            esocialSend: true,
          },
        },

        //* homogeneousGroup
        homogeneousGroup: {
          where: { type: 'HIERARCHY' },
          select: { id: true },
        },

        //* hierarchy
        hierarchy: {
          select: {
            id: true,
            description: true,
            type: true,
            parentId: true,
            hierarchyOnHomogeneous: {
              select: {
                endDate: true,
                startDate: true,
                homogeneousGroupId: true,
              },
            },
          },
        },

        //*Employees
        employees: {
          where: {
            companyId,
            OR: [
              { pppHistory: { none: { id: { gt: 0 } } } },
              { pppHistory: { some: { sendEvent: true } } },
            ],
          },
          select: {
            id: true,
            cpf: true,
            pppHistory: true,
            esocialCode: true,
            hierarchyHistory: {
              where: { motive: { not: 'DEM' } },
              select: {
                startDate: true,
                hierarchyId: true,
                employeeId: true,
                subHierarchies: { select: { id: true } },
              },
            },
          },
        },
      },
    });

    return company;
  }

  onGetRisks = (riskData: RiskFactorDataEntity[]) => {
    const risks: Record<
      string,
      { riskData: RiskFactorDataEntity[]; riskFactor: RiskFactorsEntity }
    > = {};

    riskData.forEach((_rd) => {
      if (_rd?.riskFactor?.representAll) return;

      if (!risks[_rd.riskId])
        risks[_rd.riskId] = {
          riskData: [],
          riskFactor: _rd.riskFactor,
        };

      _rd.riskFactor = undefined;
      risks[_rd.riskId].riskData.push(_rd);
    });

    return Object.values(risks).map((data) => {
      data.riskData
        .sort((a, b) => sortNumber(b.level, a.level))
        .sort((a, b) => sortNumber(b.isQuantity ? 1 : 0, a.isQuantity ? 1 : 0))
        .sort((a, b) => sortNumber(a.prioritization, b.prioritization));

      return data;
    });
  };
}
