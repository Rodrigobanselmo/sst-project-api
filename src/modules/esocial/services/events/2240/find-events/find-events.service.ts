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
import { mapInverseResAso, mapInverseTpExameOcup } from '../../../../interfaces/event-2220';
import { HierarchyOnHomogeneousEntity, HomoGroupEntity } from '../../../../../company/entities/homoGroup.entity';
import { HierarchyEnum, HomogeneousGroup } from '@prisma/client';
import { RiskFactorsEntity } from '../../../../../../modules/sst/entities/risk.entity';
import { DayJSProvider } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import sortArray from 'sort-array';

interface ITimeline {
  remove?: boolean;
  date: Date;
  id: string;
}

interface IBreakPointPPP {
  riskData: RiskFactorDataEntity[];
  date: Date;
}

@Injectable()
export class FindEvents2240ESocialService {
  private end = true;
  private start = false;
  constructor(
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly riskRepository: RiskRepository,
    private readonly dayjsProvider: DayJSProvider,
  ) {}

  async execute({ skip, take, ...query }: FindEvents2240Dto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const { company } = await this.eSocialMethodsProvider.getCompany(companyId);

    const startDate = company.esocialStart;
    const esocialSend = company.esocialSend;
    if (!startDate || esocialSend === null)
      return {
        data: [],
        count: 0,
        error: {
          message: 'Data de início do eSocial ou tipo de envio não informado para essa empresa',
        },
      };

    const companyFound = await this.getCompany(companyId);
    const homogeneousTree = await this.getHomoTree(companyFound);
    const homoRiskDataTree = await this.getRiskData(companyFound, homogeneousTree);
    const hierarchyTree = await this.getHierarchyTree(companyFound);

    const employeeTree = {} as Record<string, EmployeeEntity & { actualPPPHistory?: EmployeePPPHistoryEntity[] }>;
    [companyFound.employees.find((e) => e.id == 5920)].forEach((employee) => {
      const timeline = {};
      employee.hierarchyHistory.forEach((history, index) => {
        if (history.motive == 'DEM') return;
        const startDate = this.onGetDate(history.startDate);
        const endDate = this.onGetDate(employee.hierarchyHistory[index + 1]?.startDate);

        timeline[this.dayjsProvider.format(startDate, 'YYYYMMDD')] = {};
        if (endDate) timeline[this.dayjsProvider.format(endDate, 'YYYYMMDD')] = {};

        const hierarchyIds = [history.hierarchyId, ...history.subHierarchies.map((i) => i.id)];

        const hierarchyOnHomogeneous = hierarchyIds
          .map((id) => hierarchyTree[id].hierarchyOnHomogeneous)
          .reduce((acc, curr) => {
            return [...acc, ...curr];
          }, []);

        const pppSnapshot: Record<string, IBreakPointPPP> = {};
        if (startDate) pppSnapshot[this.onGetStringDate(startDate)] = { riskData: [], date: startDate };

        const riskTimeline = hierarchyOnHomogeneous.reduce<RiskFactorDataEntity[]>((acc, hh) => {
          const hhStartDate = this.onGetDate(hh.startDate);
          const hhEndDate = this.onGetDate(hh.endDate);

          const { timeline, breakPoint } = this.cutTimeline(homoRiskDataTree[hh.homogeneousGroupId], endDate, [endDate, hhEndDate], [startDate, hhStartDate]);

          Object.assign(pppSnapshot, breakPoint);

          return [...acc, ...timeline];
        }, [] as RiskFactorDataEntity[]);

        const timelinePPPSnapshots = this.createTimelinePPPSnapshot(riskTimeline, pppSnapshot);

        // (history as any).riskTimeline = this.onGetRisks(riskTimeline);
        (history as any).riskTimeline = riskTimeline;
        (history as any).pppSnapshot = pppSnapshot;
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

    // check hierarchy ppp risks if
    // -> risk data has been added / edited
    // -> risk data info has been edited
    // -> GHO has been edited (endDate / hierarchies) (add does not matter because will need to add risk inside to make the difference)
    // ->
    // ->

    // check employee ppp risks if
    // -> hierarchy has been added / edited
    // -> amb. engineering changed
    // ->

    return;

    const { data: employees3, count } = await this.employeeRepository.findEvent2220(
      {
        startDate,
        companyId,
        ...query,
      },
      { take: 1000 },
      { select: { name: true } },
    );

    const eventsStruct = this.eSocialEventProvider.convertToEvent2220Struct(company, employees3);

    const eventsXml = eventsStruct.map((data) => {
      const eventErrors = this.eSocialEventProvider.errorsEvent2220(data.event);
      const xmlResult = this.eSocialEventProvider.generateXmlEvent2220(
        data.event,
        // { declarations: true },
      );

      const company = data.employee?.company;
      delete data.employee?.company;

      let type: ESocialSendEnum = ESocialSendEnum.SEND;
      if (data.aso?.events?.some((e) => ['DONE', 'TRANSMITTED'].includes(e.status))) {
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

  async getRiskData(company: CompanyEntity, homoTree: Record<string, HomogeneousGroup>) {
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
            probability: true,
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
      delete risk.vmp;
      risk.riskFactorData.forEach((_riskData) => {
        const riskCopy = clone(risk);
        riskCopy.riskFactorData = undefined;

        if (!homoTree[_riskData.homogeneousGroupId]) _riskData.prioritization = 0;
        else _riskData.prioritization = 3;

        _riskData.riskFactor = riskCopy;
        riskDataAll.push(_riskData);
      });
    });

    const riskData = checkRiskDataDoc(riskDataAll, {
      docType: 'isPPP',
      companyId,
    });

    const homoRiskDataIdsTree = {} as Record<string, string[]>;
    const riskDataTree = {} as Record<string, RiskFactorDataEntity>;
    const homoRiskDataTree = {} as Record<string, RiskFactorDataEntity[]>;

    riskData.forEach((rd) => {
      if (rd.riskFactor?.docInfo) delete rd.riskFactor.docInfo;
      delete rd.progress;
      delete rd.epis;
      delete rd.engs;
      delete rd.exams;

      if (!homoRiskDataIdsTree[rd.homogeneousGroupId]) homoRiskDataIdsTree[rd.homogeneousGroupId] = [];
      homoRiskDataIdsTree[rd.homogeneousGroupId].push(rd.id);

      riskDataTree[rd.id] = rd;
    });

    company.hierarchy.forEach((hierarchy) => {
      const prioritization = originRiskMap[hierarchy.type]?.prioritization;
      hierarchy.hierarchyOnHomogeneous.forEach((hierOnHomo) => {
        homoRiskDataIdsTree?.[hierOnHomo.homogeneousGroupId]?.forEach((id) => {
          if (prioritization && !riskDataTree[id].prioritization) riskDataTree[id].prioritization = prioritization;
        });
      });
    });

    Object.values(riskDataTree).forEach((rd) => {
      if (!homoRiskDataTree[rd.homogeneousGroupId]) homoRiskDataTree[rd.homogeneousGroupId] = [];
      rd.startDate = this.onGetDate(rd.startDate);
      rd.endDate = this.onGetDate(rd.endDate);

      homoRiskDataTree[rd.homogeneousGroupId].push(rd);
    });

    return homoRiskDataTree;
  }

  async getHomoTree(company: CompanyEntity) {
    const homoTree = {} as Record<string, HomogeneousGroup>;
    company.homogeneousGroup.forEach((homo) => {
      homoTree[homo.id] = homo;
    });

    return homoTree;
  }

  async getHierarchyTree(company: CompanyEntity) {
    const hierarchyTree = {} as Record<string, HierarchyEntity>;

    const hierarchies = company.hierarchy
      .map((h) => {
        const isOffice = h.type === HierarchyEnum.OFFICE;
        const isSubOffice = h.type === HierarchyEnum.SUB_OFFICE;

        if (!isOffice && !isSubOffice) return;

        const hierOnHomo: HierarchyOnHomogeneousEntity[] = [...h.hierarchyOnHomogeneous];

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

        return h;
      })
      .filter((i) => i);

    const hierarchiesTree = {} as Record<string, HierarchyEntity>;
    hierarchies.forEach((h) => {
      hierarchiesTree[h.id] = h;
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
            OR: [{ pppHistory: { none: { id: { gt: 0 } } } }, { pppHistory: { some: { sendEvent: true } } }],
          },
          select: {
            id: true,
            cpf: true,
            pppHistory: true,
            esocialCode: true,
            hierarchyHistory: {
              // where: { motive: { not: 'DEM' } },
              select: {
                startDate: true,
                motive: true,
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
    const risks: Record<string, { riskData: RiskFactorDataEntity[]; riskFactor: RiskFactorsEntity }> = {};

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
      data.riskData =
        sortArray(data.riskData, {
          by: ['prioritization', 'level', 'isQuantity'],
          order: ['prioritization', 'level', 'isQuantity'],
        }) || [];

      return {
        risk: data.riskFactor,
        riskData: data.riskData[0],
      };
    });
  };

  onGetDate = (date: Date | null | number) => {
    // return date ? new Date(date) : null;
    if (typeof date === 'number') return this.dayjsProvider.dayjs(date).startOf('day').toDate();
    return date ? this.dayjsProvider.dayjs(date).startOf('day').toDate() : null;
  };

  onGetNextDate = (date: Date | null | number) => {
    // return date ? new Date(date) : null;
    if (typeof date === 'number') return this.dayjsProvider.dayjs(date).add(1, 'day').startOf('day').toDate();
    return date ? this.dayjsProvider.dayjs(date).add(1, 'day').startOf('day').toDate() : null;
  };

  onGetStringDate = (date: Date | number) => {
    // return this.dayjsProvider.dayjs(date).startOf('day').toISOString();
    if (typeof date === 'number') date = new Date(date);
    return date.toISOString().slice(0, 10);
  };

  isDateBetween = (date: Date | null, startDate: Date | null, endDate: Date | null) => {
    const isStartBefore = !startDate || !date || date >= startDate;
    if (!isStartBefore) return false;
    const isEndAfter = !endDate || !date || date < endDate;
    return isStartBefore && isEndAfter;
  };

  isDateAfterEndDate = (testDate: Date | null, endDate: Date | null) => {
    if (!endDate) return false;
    if (!testDate) return true;

    if (endDate < testDate) return false;

    return true;
  };

  isDateBeforeStartDate = (testDate: Date | null, startDate: Date | null) => {
    if (!startDate) return false;
    if (!testDate) return true;

    if (testDate < startDate) return true;

    return false;
  };

  createTimelinePPPSnapshot = (riskData: RiskFactorDataEntity[], breakPoint: Record<string, IBreakPointPPP>) => {
    const breakPointList = Object.entries(breakPoint);
    // const breakPointPPP: Record<string, IBreakPointPPP> = {};

    riskData.forEach((rd) => {
      breakPointList.forEach(([key, value]) => {
        const isBetween = this.isDateBetween(value.date, rd.startDate, rd.endDate);
        if (isBetween) breakPoint[key].riskData.push(rd);
      });
    });
  };

  cutTimeline = (riskData: RiskFactorDataEntity[], maxEndDate: Date, endDates: Date[], startDates: Date[]) => {
    const minEndDate = Math.min(...endDates.map((e) => (e ? e.getTime() : 9999999999999))) || null;
    const maxStartDate = Math.max(...startDates.map((e) => e?.getTime() ?? 0)) || null;

    const breakPoint: Record<string, IBreakPointPPP> = {};

    if (minEndDate != 9999999999999 && maxEndDate.getTime() != minEndDate)
      breakPoint[this.onGetStringDate(minEndDate)] = { riskData: [], date: this.onGetDate(minEndDate) };
    if (maxStartDate) breakPoint[this.onGetStringDate(maxStartDate)] = { riskData: [], date: this.onGetDate(maxStartDate) };

    const timeline = riskData.reduce<RiskFactorDataEntity[]>((acc, rd) => {
      const removeIfAfter = minEndDate && rd.startDate && rd.startDate.getTime() >= minEndDate;
      if (removeIfAfter) return acc;

      const removeIfBefore = maxStartDate && rd.endDate && rd.endDate.getTime() <= maxStartDate;
      if (removeIfBefore) return acc;

      const setEndDate = minEndDate && rd.endDate && rd.endDate.getTime() >= minEndDate;
      const setStartDateOnly = maxStartDate && rd.startDate && rd.startDate.getTime() <= maxStartDate;

      const rdClone = clone(rd);

      if (setEndDate || !rd.endDate) rdClone.endDate = this.onGetDate(minEndDate);
      else breakPoint[this.onGetStringDate(rdClone.endDate)] = { riskData: [], date: this.onGetDate(rdClone.endDate) };

      if (setStartDateOnly || !rd.startDate) rdClone.startDate = this.onGetDate(maxStartDate);
      else breakPoint[this.onGetStringDate(rdClone.startDate)] = { riskData: [], date: this.onGetDate(rdClone.startDate) };

      return [...acc, rdClone];
    }, [] as RiskFactorDataEntity[]);

    return { timeline, breakPoint };
  };

  // addTimeline = (rd: RiskFactorDataEntity): ITimeline[] => {
  //   const timeline: ITimeline[] = [];

  //   const startDate = this.onGetDate(rd.startDate);
  //   const endDate = this.onGetDate(rd.endDate, this.end);

  //   timeline.push(this.addTimelineItem(startDate, rd.id, this.start));
  //   if (endDate) timeline.push(this.addTimelineItem(endDate, rd.id, this.end));

  //   return timeline;
  // };

  // addTimelineItem = (date: Date, id: string, isEnd: boolean): ITimeline => {
  //   return {
  //     date,
  //     id,
  //     ...(isEnd && { remove: isEnd }),
  //   };
  // };
}
