"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindEvents2240ESocialService = void 0;
const prisma_service_1 = require("./../../../../../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const clone_1 = __importDefault(require("clone"));
const sort_array_1 = __importDefault(require("sort-array"));
const esocial_1 = require("../../../../../../shared/constants/enum/esocial");
const DayJSProvider_1 = require("../../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const ESocialEventProvider_1 = require("../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider");
const ESocialMethodsProvider_1 = require("../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider");
const CompanyRepository_1 = require("../../../../../company/repositories/implementations/CompanyRepository");
const EmployeeRepository_1 = require("../../../../../company/repositories/implementations/EmployeeRepository");
const origin_risk_1 = require("./../../../../../../shared/constants/maps/origin-risk");
const upload_pgr_doc_service_1 = require("./../../../../../documents/services/pgr/document/upload-pgr-doc.service");
const RiskRepository_1 = require("./../../../../../sst/repositories/implementations/RiskRepository");
const onGetRisks_1 = require("../../../../../../shared/utils/onGetRisks");
let FindEvents2240ESocialService = class FindEvents2240ESocialService {
    constructor(eSocialEventProvider, eSocialMethodsProvider, employeeRepository, companyRepository, riskRepository, dayjsProvider, prisma) {
        this.eSocialEventProvider = eSocialEventProvider;
        this.eSocialMethodsProvider = eSocialMethodsProvider;
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.riskRepository = riskRepository;
        this.dayjsProvider = dayjsProvider;
        this.prisma = prisma;
        this.end = true;
        this.start = false;
        this.onGetRisks = (riskData) => {
            return (0, onGetRisks_1.onGetRisks)(riskData).map((rd) => ({ riskData: rd.riskData[0], riskFactor: rd.riskFactor }));
        };
        this.onGetSector = (id, hierarchyTree) => {
            const org = hierarchyTree[id];
            if (org) {
                if (org.type == 'SECTOR')
                    return org;
                const orgParent = hierarchyTree[org.parentId];
                if (orgParent) {
                    if (orgParent.type == 'SECTOR')
                        return orgParent;
                    const orgParent2 = hierarchyTree[orgParent.parentId];
                    if (orgParent2) {
                        if (orgParent2.type == 'SECTOR')
                            return orgParent2;
                    }
                }
            }
        };
        this.onGetDate = (date) => {
            if (typeof date === 'number')
                return this.dayjsProvider.dayjs(date).startOf('day').toDate();
            return date ? this.dayjsProvider.dayjs(date).startOf('day').toDate() : null;
        };
        this.onGetStringDate = (date) => {
            if (typeof date === 'number')
                date = new Date(date);
            return date.toISOString().slice(0, 10);
        };
        this.isDateBetween = (date, startDate, endDate) => {
            const isStartBefore = !startDate || !date || date >= startDate;
            if (!isStartBefore)
                return false;
            const isEndAfter = !endDate || !date || date < endDate;
            return isStartBefore && isEndAfter;
        };
        this.isDateAfterEndDate = (testDate, endDate) => {
            if (!endDate)
                return false;
            if (!testDate)
                return true;
            if (endDate < testDate)
                return false;
            return true;
        };
        this.isDateBeforeStartDate = (testDate, startDate) => {
            if (!startDate)
                return false;
            if (!testDate)
                return true;
            if (testDate < startDate)
                return true;
            return false;
        };
        this.createTimelinePPPSnapshot = (riskData, breakPoint) => {
            const breakPointList = Object.entries(breakPoint);
            riskData.forEach((rd) => {
                breakPointList.forEach(([key, value]) => {
                    const isBetween = this.isDateBetween(value.date, rd.startDate, rd.endDate);
                    if (isBetween)
                        breakPoint[key].riskData.push(rd);
                });
            });
        };
        this.cutTimeline = (riskData, endDates, startDates) => {
            const minEndDate = Math.min(...endDates.map((e) => (e ? e.getTime() : 9999999999999))) || null;
            const maxStartDate = Math.max(...startDates.map((e) => { var _a; return (_a = e === null || e === void 0 ? void 0 : e.getTime()) !== null && _a !== void 0 ? _a : 0; })) || null;
            const maxEndDate = endDates[0];
            const breakPoint = {};
            if (maxStartDate >= minEndDate)
                return { timeline: [], breakPoint: {} };
            if (minEndDate != 9999999999999 && maxEndDate && maxEndDate.getTime() != minEndDate)
                breakPoint[this.onGetStringDate(minEndDate)] = { riskData: [], date: this.onGetDate(minEndDate) };
            if (maxStartDate)
                breakPoint[this.onGetStringDate(maxStartDate)] = { riskData: [], date: this.onGetDate(maxStartDate) };
            const timeline = (riskData === null || riskData === void 0 ? void 0 : riskData.reduce((acc, rd) => {
                const removeIfAfter = minEndDate && rd.startDate && rd.startDate.getTime() >= minEndDate;
                if (removeIfAfter)
                    return acc;
                const removeIfBefore = maxStartDate && rd.endDate && rd.endDate.getTime() <= maxStartDate;
                if (removeIfBefore)
                    return acc;
                const setEndDate = minEndDate && rd.endDate && rd.endDate.getTime() >= minEndDate;
                const setStartDateOnly = maxStartDate && rd.startDate && rd.startDate.getTime() <= maxStartDate;
                const rdClone = (0, clone_1.default)(rd);
                if (setEndDate || !rd.endDate)
                    rdClone.endDate = this.onGetDate(minEndDate);
                else
                    breakPoint[this.onGetStringDate(rdClone.endDate)] = { riskData: [], date: this.onGetDate(rdClone.endDate) };
                if (setStartDateOnly || !rd.startDate)
                    rdClone.startDate = this.onGetDate(maxStartDate);
                else
                    breakPoint[this.onGetStringDate(rdClone.startDate)] = { riskData: [], date: this.onGetDate(rdClone.startDate) };
                return [...acc, rdClone];
            }, [])) || [];
            return { timeline, breakPoint };
        };
    }
    async execute(_a, user) {
        var { skip, take } = _a, query = __rest(_a, ["skip", "take"]);
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
        const employees2240 = await this.findEmployee2240(company);
        const eventsStruct = this.eSocialEventProvider.convertToEvent2240Struct({ company, employees: employees2240 });
        {
            const updateIsSame = eventsStruct.filter((e) => e.isSame && e.receipt).map((e) => e.ppp.id);
            await this.prisma.employeePPPHistory.updateMany({ where: { id: { in: updateIsSame } }, data: { sendEvent: false } });
            const updateIsExcludeNotExist = eventsStruct.filter((e) => e.isExclude && !e.receipt).map((e) => e.ppp.id);
            await this.prisma.employeePPPHistory.deleteMany({ where: { id: { in: updateIsExcludeNotExist } } });
        }
        const eventsXml = eventsStruct
            .filter((e) => !e.isSame)
            .map((data) => {
            var _a, _b, _c;
            const eventErrors = this.eSocialEventProvider.errorsEvent2240(data.event);
            const xmlResult = !data.isExclude ? this.eSocialEventProvider.generateXmlEvent2240(data.event) : '';
            let type = esocial_1.ESocialSendEnum.SEND;
            if (data === null || data === void 0 ? void 0 : data.isExclude)
                type = esocial_1.ESocialSendEnum.EXCLUDE;
            if ((_a = data.event) === null || _a === void 0 ? void 0 : _a.ideEvento.nrRecibo)
                type = esocial_1.ESocialSendEnum.MODIFIED;
            return {
                doneDate: ((_b = data.event) === null || _b === void 0 ? void 0 : _b.evtExpRisco.infoExpRisco.dtIniCondicao) || new Date(),
                errors: eventErrors,
                employee: data.employee,
                type,
                risks: ((_c = data.event) === null || _c === void 0 ? void 0 : _c.evtExpRisco.infoExpRisco.agNoc.map((ag) => ag.nameAgNoc)) || [],
                xml: xmlResult,
            };
        });
        return { data: eventsXml, count: eventsXml.length };
    }
    async findEmployee2240(company) {
        const homogeneousTree = await this.getHomoTree(company);
        const homoRiskDataTree = await this.getRiskData(company, homogeneousTree);
        const hierarchyTree = await this.getHierarchyTree(company);
        const employeesData = await this.getEmployeesData(company, hierarchyTree, homoRiskDataTree);
        return employeesData;
    }
    async getRiskData(company, homoTree) {
        const companyId = company.id;
        const risks = await this.riskRepository.findNude({
            where: {
                representAll: false,
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
        const riskDataAll = [];
        risks.forEach((risk) => {
            delete risk.vmp;
            risk.riskFactorData.forEach((_riskData) => {
                const riskCopy = (0, clone_1.default)(risk);
                riskCopy.riskFactorData = undefined;
                if (!homoTree[_riskData.homogeneousGroupId])
                    _riskData.prioritization = 0;
                else
                    _riskData.prioritization = 3;
                _riskData.riskFactor = riskCopy;
                riskDataAll.push(_riskData);
            });
        });
        const riskData = (0, upload_pgr_doc_service_1.checkRiskDataDoc)(riskDataAll, {
            docType: 'isPPP',
            companyId,
        });
        const homoRiskDataIdsTree = {};
        const riskDataTree = {};
        const homoRiskDataTree = {};
        riskData.forEach((rd) => {
            var _a;
            if ((_a = rd.riskFactor) === null || _a === void 0 ? void 0 : _a.docInfo)
                delete rd.riskFactor.docInfo;
            delete rd.progress;
            delete rd.epis;
            delete rd.engs;
            delete rd.exams;
            if (!homoRiskDataIdsTree[rd.homogeneousGroupId])
                homoRiskDataIdsTree[rd.homogeneousGroupId] = [];
            homoRiskDataIdsTree[rd.homogeneousGroupId].push(rd.id);
            riskDataTree[rd.id] = rd;
        });
        company.hierarchy.forEach((hierarchy) => {
            var _a;
            const prioritization = (_a = origin_risk_1.originRiskMap[hierarchy.type]) === null || _a === void 0 ? void 0 : _a.prioritization;
            hierarchy.hierarchyOnHomogeneous.forEach((hierOnHomo) => {
                var _a;
                (_a = homoRiskDataIdsTree === null || homoRiskDataIdsTree === void 0 ? void 0 : homoRiskDataIdsTree[hierOnHomo.homogeneousGroupId]) === null || _a === void 0 ? void 0 : _a.forEach((id) => {
                    if (prioritization && !riskDataTree[id].prioritization)
                        riskDataTree[id].prioritization = prioritization;
                });
            });
        });
        Object.values(riskDataTree).forEach((rd) => {
            if (!homoRiskDataTree[rd.homogeneousGroupId])
                homoRiskDataTree[rd.homogeneousGroupId] = [];
            rd.startDate = this.onGetDate(rd.startDate);
            rd.endDate = this.onGetDate(rd.endDate);
            homoRiskDataTree[rd.homogeneousGroupId].push(rd);
        });
        return homoRiskDataTree;
    }
    async getHomoTree(company) {
        const homoTree = {};
        company.homogeneousGroup.forEach((homo) => {
            homoTree[homo.id] = homo;
        });
        return homoTree;
    }
    async getHierarchyTree(company) {
        const hierarchiesTree = {};
        company.hierarchy.forEach((h) => (hierarchiesTree[h.id] = h));
        const hierarchies = company.hierarchy
            .map((h) => {
            const isOffice = h.type === client_1.HierarchyEnum.OFFICE;
            const isSubOffice = h.type === client_1.HierarchyEnum.SUB_OFFICE;
            if (!isOffice && !isSubOffice) {
                hierarchiesTree[h.id] = h;
                return;
            }
            const hierOnHomo = [...h.hierarchyOnHomogeneous];
            if (isOffice) {
                function loop(parent) {
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
    async getEmployeesData(company, hierarchyTree, homoRiskDataTree) {
        const employeesData = [];
        [company.employees.find((e) => e.id == 5920)].forEach((employee) => {
            const allHistory = employee.hierarchyHistory.reduce((acc, history, index, array) => {
                var _a;
                const startDate = this.onGetDate(history.startDate);
                const endDate = this.onGetDate((_a = array[index + 1]) === null || _a === void 0 ? void 0 : _a.startDate);
                const responsibles = company.professionalsResponsibles;
                const newAcc = {};
                newAcc[startDate.getTime()] = history;
                responsibles.forEach((professional) => {
                    const profStartDate = this.onGetDate(professional.startDate);
                    const newHistory = Object.assign(Object.assign({}, history), { ambProfessional: professional.professional });
                    if (profStartDate <= startDate) {
                        return (newAcc[startDate.getTime()] = newHistory);
                    }
                    const isBetween = this.isDateBetween(profStartDate, startDate, endDate);
                    if (isBetween)
                        newAcc[profStartDate.getTime()] = Object.assign(Object.assign({}, newHistory), { startDate: profStartDate });
                });
                return [...acc, ...Object.values(newAcc)];
            }, []);
            const hierarchyHistory = (0, sort_array_1.default)(allHistory, { by: ['startDate'], order: 'asc' });
            const timeline = hierarchyHistory
                .map((history, index, array) => {
                var _a;
                if (history.motive == 'DEM')
                    return;
                const startDate = this.onGetDate(history.startDate);
                const endDate = this.onGetDate((_a = array[index + 1]) === null || _a === void 0 ? void 0 : _a.startDate);
                if (startDate == endDate)
                    return;
                const hierarchyIds = [history.hierarchyId, ...history.subHierarchies.map((i) => i.id)];
                const hierarchy = hierarchyTree[history.hierarchyId];
                const sector = this.onGetSector(hierarchy.parentId, hierarchyTree);
                const hierarchyOnHomogeneous = hierarchyIds
                    .map((id) => hierarchyTree[id].hierarchyOnHomogeneous)
                    .reduce((acc, curr) => {
                    return [...acc, ...curr];
                }, []);
                const pppSnapshot = {};
                if (startDate)
                    pppSnapshot[this.onGetStringDate(startDate)] = { riskData: [], date: startDate, desc: '' };
                const riskTimeline = hierarchyOnHomogeneous.reduce((acc, hh) => {
                    const hhStartDate = this.onGetDate(hh.startDate);
                    const hhEndDate = this.onGetDate(hh.endDate);
                    const { timeline, breakPoint } = this.cutTimeline(homoRiskDataTree[hh.homogeneousGroupId] || [], [endDate, hhEndDate], [startDate, hhStartDate]);
                    Object.assign(pppSnapshot, breakPoint);
                    return [...acc, ...timeline];
                }, []);
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
                return Object.assign(Object.assign({}, acc), curr);
            });
            Object.entries(timeline).forEach(([key, value]) => {
                timeline[key].risks = this.onGetRisks(value.riskData);
                delete timeline[key].riskData;
            });
            const actualPPPHistory = Object.values(timeline);
            delete employee.hierarchyHistory;
            employeesData.push(Object.assign(Object.assign({}, employee), { actualPPPHistory }));
        });
        return employeesData;
    }
    async getCompany(companyId, options) {
        var _a, _b, _c;
        const { company } = await this.eSocialMethodsProvider.getCompany(companyId, {
            select: Object.assign(Object.assign(Object.assign({ professionalsResponsibles: {
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
                }, cert: !!(options === null || options === void 0 ? void 0 : options.cert) }, (!!(options === null || options === void 0 ? void 0 : options.report) && {
                report: true,
            })), (!!(options === null || options === void 0 ? void 0 : options.cert) && {
                receivingServiceContracts: {
                    select: {
                        applyingServiceCompany: {
                            select: { cert: true },
                        },
                    },
                },
            })), { group: {
                    select: Object.assign(Object.assign({}, (!!(options === null || options === void 0 ? void 0 : options.cert) && {
                        company: { select: { cert: true } },
                    })), { companyGroup: {
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
                        } }),
                }, homogeneousGroup: {
                    where: { type: 'HIERARCHY' },
                    select: { id: true },
                }, hierarchy: {
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
                }, employees: {
                    where: {
                        companyId,
                        OR: [{ pppHistory: { every: { status: { in: ['DONE', 'TRANSMITTED'] } } } }, { pppHistory: { some: { sendEvent: true } } }],
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
                            select: {
                                startDate: true,
                                motive: true,
                                hierarchyId: true,
                                employeeId: true,
                                subHierarchies: { select: { id: true } },
                            },
                        },
                    },
                } }),
        });
        const cert = (company === null || company === void 0 ? void 0 : company.cert) || ((_a = company === null || company === void 0 ? void 0 : company.group) === null || _a === void 0 ? void 0 : _a.cert) || ((_c = (_b = company === null || company === void 0 ? void 0 : company.receivingServiceContracts) === null || _b === void 0 ? void 0 : _b[0].applyingServiceCompany) === null || _c === void 0 ? void 0 : _c.cert);
        if ((options === null || options === void 0 ? void 0 : options.cert) && !cert)
            throw new common_1.BadRequestException('Certificado digital não cadastrado');
        return { cert, company };
    }
};
FindEvents2240ESocialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ESocialEventProvider_1.ESocialEventProvider,
        ESocialMethodsProvider_1.ESocialMethodsProvider,
        EmployeeRepository_1.EmployeeRepository,
        CompanyRepository_1.CompanyRepository,
        RiskRepository_1.RiskRepository,
        DayJSProvider_1.DayJSProvider,
        prisma_service_1.PrismaService])
], FindEvents2240ESocialService);
exports.FindEvents2240ESocialService = FindEvents2240ESocialService;
//# sourceMappingURL=find-events.service.js.map