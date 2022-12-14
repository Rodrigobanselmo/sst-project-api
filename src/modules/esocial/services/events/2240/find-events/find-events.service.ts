import { PrismaService } from './../../../../../../prisma/prisma.service';
import { ICompanyOptions } from './../../../../../../shared/providers/ESocialProvider/models/IESocialMethodProvider';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyEnum, HomogeneousGroup } from '@prisma/client';
import clone from 'clone';
import sortArray from 'sort-array';

import { EmployeeHierarchyHistoryEntity } from '../../../../../../modules/company/entities/employee-hierarchy-history.entity';
import { RiskFactorsEntity } from '../../../../../../modules/sst/entities/risk.entity';
import { ESocialSendEnum } from '../../../../../../shared/constants/enum/esocial';
import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { HierarchyOnHomogeneousEntity } from '../../../../../company/entities/homoGroup.entity';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { FindEvents2240Dto } from '../../../../dto/event.dto';
import { originRiskMap } from './../../../../../../shared/constants/maps/origin-risk';
import { CompanyEntity } from './../../../../../company/entities/company.entity';
import { HierarchyEntity } from './../../../../../company/entities/hierarchy.entity';
import { checkRiskDataDoc } from './../../../../../documents/services/pgr/document/upload-pgr-doc.service';
import { RiskFactorDataEntity } from './../../../../../sst/entities/riskData.entity';
import { RiskRepository } from './../../../../../sst/repositories/implementations/RiskRepository';
import { ProfessionalEntity } from './../../../../../users/entities/professional.entity';
import { IBreakPointPPP, IEmployee2240Data, IPriorRiskData } from './../../../../interfaces/event-2240';
import { onGetRisks } from '../../../../../../shared/utils/onGetRisks';

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
    private readonly prisma: PrismaService,
  ) {}

  async execute({ skip, take, ...query }: FindEvents2240Dto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const { company } = await this.getCompany(companyId);
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

    const employees2240 = await this.findEmployee2240(company, startDate);

    const eventsStruct = this.eSocialEventProvider.convertToEvent2240Struct({ company, esocialStartDate: startDate, employees: employees2240 });

    // update when is same as before
    {
      const updateIsSame = eventsStruct.filter((e) => e.isSame && e.receipt).map((e) => e.ppp.id);
      await this.prisma.employeePPPHistory.updateMany({ where: { id: { in: updateIsSame } }, data: { sendEvent: false } });
      const updateIsExcludeNotExist = eventsStruct.filter((e) => e.isExclude && !e.receipt).map((e) => e.ppp.id);
      await this.prisma.employeePPPHistory.deleteMany({ where: { id: { in: updateIsExcludeNotExist } } });
    }

    const eventsXml = eventsStruct
      .filter((e) => !e.isSame)
      .map((data) => {
        const eventErrors = this.eSocialEventProvider.errorsEvent2240(data.event);

        const xmlResult = !data.isExclude ? this.eSocialEventProvider.generateXmlEvent2240(data.event) : '';

        let type: ESocialSendEnum = ESocialSendEnum.SEND;
        if (data?.isExclude) type = ESocialSendEnum.EXCLUDE;
        if (data.event?.ideEvento.nrRecibo) type = ESocialSendEnum.MODIFIED;

        return {
          doneDate: data.event?.evtExpRisco.infoExpRisco.dtIniCondicao || new Date(),
          errors: eventErrors,
          employee: data.employee,
          type,
          risks: data.event?.evtExpRisco.infoExpRisco.agNoc.map((ag) => ag.nameAgNoc) || [],
          xml: xmlResult,
        };
      });

    return { data: eventsXml, count: eventsXml.length };

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
  }

  async findEmployee2240(company: CompanyEntity, esocialStartDate: Date) {
    const homogeneousTree = await this.getHomoTree(company);
    const homoRiskDataTree = await this.getRiskData(company, homogeneousTree);
    const hierarchyTree = await this.getHierarchyTree(company);
    const employeesData = await this.getEmployeesData(company, hierarchyTree, homoRiskDataTree, esocialStartDate);

    return employeesData;
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
        unit: true,
        method: true,
        nr15lt: true,
        isPPP: true,
        esocial: { select: { id: true, isQuantity: true } },
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
            epiToRiskFactorData: { select: { epi: { select: { ca: true } }, efficientlyCheck: true } },
            engsToRiskFactorData: { select: { efficientlyCheck: true, recMed: { select: { medName: true } } } },
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
    const hierarchiesTree = {} as Record<string, HierarchyEntity>;

    company.hierarchy.forEach((h) => (hierarchiesTree[h.id] = h));
    const hierarchies = company.hierarchy
      .map((h) => {
        const isOffice = h.type === HierarchyEnum.OFFICE;
        const isSubOffice = h.type === HierarchyEnum.SUB_OFFICE;

        if (!isOffice && !isSubOffice) {
          hierarchiesTree[h.id] = h;
          return;
        }

        const hierOnHomo: HierarchyOnHomogeneousEntity[] = [...h.hierarchyOnHomogeneous];

        if (isOffice) {
          function loop(parent?: HierarchyEntity) {
            if (parent) {
              hierOnHomo.push(...parent.hierarchyOnHomogeneous);
              const nextParent = hierarchiesTree[parent.parentId];
              loop(nextParent);
            }
          }

          const parent = hierarchiesTree[h.parentId];
          loop(parent);
        }

        h.hierarchyOnHomogeneous = hierOnHomo;

        return h;
      })
      .filter((i) => i);

    hierarchies.forEach((h) => {
      hierarchiesTree[h.id] = h;
    });

    return hierarchiesTree;
  }

  async getEmployeesData(
    company: CompanyEntity,
    hierarchyTree: Record<string, HierarchyEntity>,
    homoRiskDataTree: Record<string, RiskFactorDataEntity[]>,
    esocialStartDate: Date,
  ) {
    const employeesData = [] as IEmployee2240Data[];
    //! company.employees.forEach((employee) => {
    company.employees.forEach((employee) => {
      // const timeline = {};
      const allHistory = employee.hierarchyHistory.reduce<(EmployeeHierarchyHistoryEntity & { ambProfessional?: Partial<ProfessionalEntity> })[]>(
        (acc, history, index, array) => {
          const startDate = this.onGetDate(history.startDate > esocialStartDate ? history.startDate : esocialStartDate);
          const endDate = this.onGetDate(array[index + 1]?.startDate);

          const responsibles = company.professionalsResponsibles;
          const newAcc: Record<number, typeof acc[0]> = {};
          newAcc[startDate.getTime()] = history;

          responsibles.forEach((professional) => {
            const profStartDate = this.onGetDate(professional.startDate);
            const newHistory = { ...history, ambProfessional: professional.professional };
            if (profStartDate <= startDate) {
              return (newAcc[startDate.getTime()] = newHistory);
            }

            const isBetween = this.isDateBetween(profStartDate, startDate, endDate);
            if (isBetween) newAcc[profStartDate.getTime()] = { ...newHistory, startDate: profStartDate };
          });

          return [...acc, ...Object.values(newAcc)];
        },
        [],
      );

      const hierarchyHistory = sortArray(allHistory, { by: ['startDate'], order: 'asc' });

      const timeline = hierarchyHistory
        .map((history, index, array) => {
          if (history.motive == 'DEM') return;
          const startDate = this.onGetDate(history.startDate > esocialStartDate ? history.startDate : esocialStartDate);
          const endDate = this.onGetDate(array[index + 1]?.startDate);

          if (startDate == endDate) return;

          const hierarchyIds = [history.hierarchyId, ...history.subHierarchies.map((i) => i.id)];
          const hierarchy = hierarchyTree[history.hierarchyId];
          const sector = this.onGetSector(hierarchy.parentId, hierarchyTree);

          const hierarchyOnHomogeneous = hierarchyIds
            .map((id) => hierarchyTree[id].hierarchyOnHomogeneous)
            .reduce((acc, curr) => {
              return [...acc, ...curr];
            }, []);

          const pppSnapshot: Record<string, IBreakPointPPP> = {};
          if (startDate) pppSnapshot[this.onGetStringDate(startDate)] = { riskData: [], date: startDate, desc: '' };

          const riskTimeline = hierarchyOnHomogeneous.reduce<RiskFactorDataEntity[]>((acc, hh) => {
            const hhStartDate = this.onGetDate(hh.startDate);
            const hhEndDate = this.onGetDate(hh.endDate);

            const { timeline, breakPoint } = this.cutTimeline(homoRiskDataTree[hh.homogeneousGroupId] || [], [endDate, hhEndDate], [startDate, hhStartDate]);

            Object.assign(pppSnapshot, breakPoint);

            return [...acc, ...timeline];
          }, [] as RiskFactorDataEntity[]);

          this.createTimelinePPPSnapshot(riskTimeline, pppSnapshot);

          Object.keys(pppSnapshot).forEach((key) => {
            pppSnapshot[key].responsible = history.ambProfessional;
            pppSnapshot[key].environments = hierarchy.workspaces.map((w) => ({ cnpj: w.cnpj || company.cnpj, sectorName: sector.name, isOwner: w.isOwner }));
            pppSnapshot[key].desc = hierarchy.description;
          });

          return pppSnapshot;
        })
        .filter((i) => i)
        .reduce((acc, curr) => {
          return { ...acc, ...curr };
        });

      Object.entries(timeline).forEach(([key, value]) => {
        timeline[key].risks = this.onGetRisks(value.riskData);
        delete timeline[key].riskData;
      });

      const actualPPPHistory = Object.values(timeline);

      const hierarchy = hierarchyTree[hierarchyHistory?.[0]?.hierarchyId];
      let sectorHierarchy = hierarchyTree[hierarchy?.parentId];
      if (sectorHierarchy && sectorHierarchy?.parentId && sectorHierarchy.type != 'SECTOR') sectorHierarchy = hierarchyTree[sectorHierarchy?.parentId];
      delete employee.hierarchyHistory;

      employeesData.push({
        ...employee,
        actualPPPHistory,
        hierarchy: { id: hierarchy.id, name: hierarchy.name },
        sectorHierarchy: { id: sectorHierarchy.id, name: sectorHierarchy.name } as any,
      });
    });
    return employeesData;
  }

  async getCompany(companyId: string, options?: ICompanyOptions) {
    const { company } = await this.eSocialMethodsProvider.getCompany(companyId, {
      select: {
        professionalsResponsibles: {
          where: { type: 'AMB' },
          orderBy: { startDate: 'desc' },
          take: 1,
          select: {
            id: true,
            type: true,
            startDate: true,
            professional: {
              include: {
                professional: {
                  select: {
                    cpf: true,
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        },

        cert: !!options?.cert,
        ...(!!options?.report && {
          report: true,
        }),
        ...(!!options?.cert && {
          receivingServiceContracts: {
            select: {
              applyingServiceCompany: {
                select: { cert: true },
              },
            },
          },
        }),

        //* company group
        group: {
          select: {
            ...(!!options?.cert && {
              company: { select: { cert: true } },
            }),
            companyGroup: {
              select: {
                professionalsResponsibles: {
                  where: { type: 'AMB' },
                  orderBy: { startDate: 'desc' },
                  take: 1,
                  select: {
                    id: true,
                    startDate: true,
                    professional: {
                      include: {
                        professional: {
                          select: {
                            cpf: true,
                            name: true,
                            id: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
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
            name: true,
            workspaces: { select: { isOwner: true, cnpj: true }, take: 9 },
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
            // OR: [{ pppHistory: { every: { status: { in: ['DONE', 'TRANSMITTED'] } } } }, { pppHistory: { some: { sendEvent: true } } }],
            OR: [{ pppHistory: { some: { sendEvent: true } } }],
          },
          select: {
            id: true,
            cpf: true,
            name: true,
            pppHistory: {
              where: {
                OR: [
                  { events: { none: { action: 'EXCLUDE', status: { in: ['DONE', 'TRANSMITTED'] } } } },
                  { events: { some: { status: { in: ['DONE', 'TRANSMITTED'] } } } },
                ],
              },
              select: {
                doneDate: true,
                id: true,
                json: true,
                status: true,
                sendEvent: true,
                events: { select: { receipt: true, id: true, status: true } },
              },
            },
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

    const cert = company?.cert || company?.group?.cert || company?.receivingServiceContracts?.[0].applyingServiceCompany?.cert;

    if (options?.cert && !cert) throw new BadRequestException('Certificado digital não cadastrado');

    return { cert, company };
  }

  onGetRisks = (riskData: RiskFactorDataEntity[]): IPriorRiskData[] => {
    return onGetRisks(riskData).map((rd) => ({ riskData: rd.riskData[0], riskFactor: rd.riskFactor }));
  };

  onGetSector = (id: string, hierarchyTree: Record<string, HierarchyEntity>) => {
    const org = hierarchyTree[id];
    if (org) {
      if (org.type == 'SECTOR') return org;
      const orgParent = hierarchyTree[org.parentId];
      if (orgParent) {
        if (orgParent.type == 'SECTOR') return orgParent;
        const orgParent2 = hierarchyTree[orgParent.parentId];
        if (orgParent2) {
          if (orgParent2.type == 'SECTOR') return orgParent2;
        }
      }
    }
  };

  onGetDate = (date: Date | null | number) => {
    // return date ? new Date(date) : null;
    if (typeof date === 'number') return this.dayjsProvider.dayjs(date).startOf('day').toDate();
    return date ? this.dayjsProvider.dayjs(date).startOf('day').toDate() : null;
  };

  onGetStringDate = (date: Date | number) => {
    // return this.dayjsProvider.dayjs(date).startOf('day').toISOString();
    if (typeof date === 'number') date = new Date(date);
    return date.toISOString().slice(0, 10);
  };

  isDateBetween = (date: Date | null, startDate: Date | null, endDate: Date | null) => {
    // true if is (equal || greater || null) on start AND (lower || null) on end

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

  cutTimeline = (riskData: RiskFactorDataEntity[], endDates: Date[], startDates: Date[]) => {
    const minEndDate = Math.min(...endDates.map((e) => (e ? e.getTime() : 9999999999999))) || null;
    const maxStartDate = Math.max(...startDates.map((e) => e?.getTime() ?? 0)) || null;

    const maxEndDate = endDates[0];
    // const minStartDate = startDates[0];

    const breakPoint: Record<string, IBreakPointPPP> = {};

    if (maxStartDate >= minEndDate) return { timeline: [], breakPoint: {} };

    if (minEndDate != 9999999999999 && maxEndDate && maxEndDate.getTime() != minEndDate)
      breakPoint[this.onGetStringDate(minEndDate)] = { riskData: [], date: this.onGetDate(minEndDate) };
    if (maxStartDate) breakPoint[this.onGetStringDate(maxStartDate)] = { riskData: [], date: this.onGetDate(maxStartDate) };

    const timeline =
      riskData?.reduce<RiskFactorDataEntity[]>((acc, rd) => {
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
      }, [] as RiskFactorDataEntity[]) || [];

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
