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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.ESocialEventProvider = void 0;
const data_sort_1 = require("./../../../utils/sorts/data.sort");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const clone_1 = __importDefault(require("clone"));
const nestjs_soap_1 = require("nestjs-soap");
const xml_js_1 = require("xml-js");
const deep_equal_1 = __importDefault(require("deep-equal"));
const event_2220_1 = require("../../../../modules/esocial/interfaces/event-2220");
const event_batch_1 = require("../../../../modules/esocial/interfaces/event-batch");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const arrayChunks_1 = require("../../../../shared/utils/arrayChunks");
const DayJSProvider_1 = require("../../DateProvider/implementations/DayJSProvider");
const esocial_1 = require("./../../../../modules/esocial/interfaces/esocial");
const event_3000_1 = require("./../../../../modules/esocial/interfaces/event-3000");
const event_batch_2 = require("./../../../../modules/esocial/interfaces/event-batch");
const ESocialBatchRepository_1 = require("./../../../../modules/esocial/repositories/implementations/ESocialBatchRepository");
const soapClient_1 = require("./../../../constants/enum/soapClient");
const number_sort_1 = require("./../../../utils/sorts/number.sort");
const ESocialMethodsProvider_1 = require("./ESocialMethodsProvider");
const event_2240_1 = require("./../../../../modules/esocial/interfaces/event-2240");
const sort_array_1 = __importDefault(require("sort-array"));
let ESocialEventProvider = class ESocialEventProvider {
    constructor(clientProduction, clientRestrict, clientConsultProduction, clientConsultRestrict, prisma, eSocialBatchRepository, dayJSProvider, eSocialMethodsProvider) {
        this.clientProduction = clientProduction;
        this.clientRestrict = clientRestrict;
        this.clientConsultProduction = clientConsultProduction;
        this.clientConsultRestrict = clientConsultRestrict;
        this.prisma = prisma;
        this.eSocialBatchRepository = eSocialBatchRepository;
        this.dayJSProvider = dayJSProvider;
        this.eSocialMethodsProvider = eSocialMethodsProvider;
        this.verProc = 'SimplesSST_1.0';
        this.indRetif = event_batch_2.IndRetifEnum.ORIGINAL;
        this.tpAmb = event_batch_2.TpAmbEnum.PROD_REST;
        this.procEmi = event_batch_1.ProcEmiEnum.SOFTWARE;
        this.tpInsc = event_batch_1.TpIncsEnum.CNPJ;
        this.eventGroup = event_batch_2.EventGroupEnum.NO_PERIODIC;
        this.onGetDate = (date) => {
            if (typeof date === 'number')
                return this.dayJSProvider.dayjs(date).startOf('day').toDate();
            return date ? this.dayJSProvider.dayjs(date).startOf('day').toDate() : null;
        };
    }
    errorsEvent2220(event) {
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
            if (!asoDoctor.nmMed && !asoDoctor.nrCRM && !asoDoctor.ufCRM) {
                errors.push({
                    message: 'Informar o médico emitente do ASO',
                });
            }
            else {
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
            if (event_2220_1.requiredObsProc.includes(exam.procRealizado)) {
                errors.push({
                    message: `Informar "Observação sobre o procedimento diagnóstico realizado" do exam ${exam.examName}`,
                });
            }
            if (event_2220_1.requiredOrdExams.includes(exam.procRealizado)) {
                errors.push({
                    message: `Informar se exame é sequencial ou inicial (${exam.examName})`,
                });
            }
        });
        return errors;
    }
    errorsEvent2240(event) {
        if (!event)
            return [];
        const infoExpRisco = event.evtExpRisco.infoExpRisco;
        const respAmb = infoExpRisco.respReg;
        const infoAmb = infoExpRisco.infoAmb;
        const agNoc = infoExpRisco.agNoc;
        const ideVinculo = event.ideVinculo;
        const errors = [];
        {
            if (!ideVinculo.cpfTrab)
                errors.push({ message: 'Informar "CPF" do empregado' });
            if (!ideVinculo.matricula)
                errors.push({ message: 'Informar "matricula" do empregado' });
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
                }
                else {
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
                var _a;
                const code = ag.codAgNoc;
                if (!code) {
                    errors.push({
                        message: `${ag.nameAgNoc}: Informar código do eSocial`,
                    });
                }
                const isEmptyRisk = event_2240_1.requiredTpAval.includes(code);
                const isRequiredDesc = event_2240_1.requiredDescAg.includes(code);
                const isRequiredLimit = event_2240_1.requiredLimTol.includes(code);
                const isQuantity = (ag === null || ag === void 0 ? void 0 : ag.tpAval) === event_2240_1.TpAvalEnum.QUANTITY;
                const epcEpi = ag === null || ag === void 0 ? void 0 : ag.epcEpi;
                const isEPCImplemented = (epcEpi === null || epcEpi === void 0 ? void 0 : epcEpi.utilizEPC) == event_2240_1.utileEpiEpcEnum.IMPLEMENTED;
                const isEPIImplemented = (epcEpi === null || epcEpi === void 0 ? void 0 : epcEpi.utilizEPI) == event_2240_1.utileEpiEpcEnum.IMPLEMENTED;
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
                    if (isEPIImplemented && !((_a = epcEpi === null || epcEpi === void 0 ? void 0 : epcEpi.epi) === null || _a === void 0 ? void 0 : _a.length))
                        errors.push({
                            message: `${ag.nameAgNoc} (${code || '-'}): Informar ca's do EPI's`,
                        });
                }
            });
        }
        return errors;
    }
    errorsEvent3000(event) {
        const infoExclusao = event === null || event === void 0 ? void 0 : event.infoExclusao;
        const errors = [];
        {
            if (!infoExclusao.ideTrabalhador.cpfTrab)
                errors.push({ message: 'Informar "CPF" do empregado' });
        }
        {
            if (!infoExclusao.nrRecEvt)
                errors.push({ message: 'Informar "recibo" do evento' });
            if (!infoExclusao.tpEvento)
                errors.push({
                    message: 'Informar "tipo de evento" para a exclusão (ex: S-2240))',
                });
        }
        return errors;
    }
    convertDate(date) {
        return this.dayJSProvider.format(date, 'YYYY-MM-DD');
    }
    convertToEvent2220Struct(company, employees, options) {
        const generateId = this.eSocialMethodsProvider.classGenerateId(company.cnpj);
        const eventsStruct = employees.reduce((acc, employee) => {
            const examsGroup = employee.examsHistory
                .sort((a, b) => (0, number_sort_1.sortNumber)(a.exam.isAttendance ? 1 : 0, b.exam.isAttendance ? 1 : 0))
                .sort((a, b) => (0, number_sort_1.sortNumber)(a.doneDate, b.doneDate))
                .reduce((_acc, exam) => {
                const cloneAcc = (0, clone_1.default)(_acc);
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
            }, [[]]);
            const examsWithAso = examsGroup.filter((exams) => exams.some((e) => e.exam.isAttendance) && exams.some((e) => e.sendEvent));
            const eventsJs = examsWithAso.map((exams) => {
                var _a, _b, _c, _d, _e;
                const aso = exams[exams.length - 1];
                const historyExams = [];
                const id = generateId.newId();
                const doctorResponsible = company === null || company === void 0 ? void 0 : company.doctorResponsible;
                const isDoctorAvailable = doctorResponsible && (doctorResponsible === null || doctorResponsible === void 0 ? void 0 : doctorResponsible.name) && (doctorResponsible === null || doctorResponsible === void 0 ? void 0 : doctorResponsible.councilId) && (doctorResponsible === null || doctorResponsible === void 0 ? void 0 : doctorResponsible.councilUF);
                const asoDoctor = aso === null || aso === void 0 ? void 0 : aso.doctor;
                const eventMed = Object.assign(Object.assign({}, (isDoctorAvailable && {
                    respMonit: Object.assign(Object.assign({}, ((doctorResponsible === null || doctorResponsible === void 0 ? void 0 : doctorResponsible.cpf) && {
                        cpfResp: doctorResponsible.cpf,
                    })), { nmResp: doctorResponsible.name, nrCRM: doctorResponsible.councilId, ufCRM: doctorResponsible.councilUF }),
                })), { tpExameOcup: event_2220_1.mapResAso[aso.examType], aso: {
                        dtAso: aso.doneDate,
                        resAso: event_2220_1.mapTpExameOcup[aso.evaluationType],
                        medico: {
                            nmMed: asoDoctor === null || asoDoctor === void 0 ? void 0 : asoDoctor.name,
                            nrCRM: asoDoctor === null || asoDoctor === void 0 ? void 0 : asoDoctor.councilId,
                            ufCRM: asoDoctor === null || asoDoctor === void 0 ? void 0 : asoDoctor.councilUF,
                        },
                        exame: exams.map((exam) => {
                            var _a, _b;
                            let isSequential = null;
                            let obsProc = null;
                            const esocial27Code = (_a = exam.exam) === null || _a === void 0 ? void 0 : _a.esocial27Code;
                            if (event_2220_1.requiredOrdExams.includes(esocial27Code)) {
                                isSequential =
                                    !!employee.examsHistory.filter((e) => { var _a; return e.status === 'DONE' && ((_a = e === null || e === void 0 ? void 0 : e.exam) === null || _a === void 0 ? void 0 : _a.esocial27Code) === exam.exam.esocial27Code; })[1] ||
                                        (examsWithAso.length === 1 && aso.examType !== client_1.ExamHistoryTypeEnum.ADMI);
                            }
                            if (event_2220_1.requiredObsProc.includes(esocial27Code)) {
                                obsProc = (_b = exam.exam) === null || _b === void 0 ? void 0 : _b.obsProc;
                            }
                            historyExams.push(exam);
                            return Object.assign(Object.assign({ examName: exam.exam.name, dtExm: exam.doneDate, procRealizado: esocial27Code }, (isSequential != null && {
                                ordExame: isSequential ? 2 : 1,
                            })), (obsProc != null && { obsProc }));
                        }),
                    } });
                const receipt = (_c = (_b = (_a = aso === null || aso === void 0 ? void 0 : aso.events) === null || _a === void 0 ? void 0 : _a.sort((a, b) => (0, data_sort_1.sortData)(b.created_at, a.created_at))) === null || _b === void 0 ? void 0 : _b.find((e) => e.receipt)) === null || _c === void 0 ? void 0 : _c.receipt;
                const event = {
                    id,
                    exMedOcup: eventMed,
                    ideEmpregador: { nrInsc: company.cnpj },
                    ideVinculo: {
                        cpfTrab: employee.cpf,
                        matricula: employee.esocialCode,
                    },
                    ideEvento: Object.assign({ tpAmb: (_d = options === null || options === void 0 ? void 0 : options.ideEvento) === null || _d === void 0 ? void 0 : _d.tpAmb, procEmi: (_e = options === null || options === void 0 ? void 0 : options.ideEvento) === null || _e === void 0 ? void 0 : _e.procEmi }, (receipt && {
                        indRetif: event_batch_2.IndRetifEnum.MODIFIED,
                        nrRecibo: receipt,
                    })),
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
    convertToEvent2240Struct(props, options) {
        const company = props.company;
        const employeesData = props.employees;
        const generateId = this.eSocialMethodsProvider.classGenerateId(company.cnpj);
        const eventsStruct = employeesData.reduce((acc, employee) => {
            const getEpcType = (risk) => {
                const isEPCPresent = !!risk.riskData.engsToRiskFactorData.find((e) => { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.recMed) === null || _a === void 0 ? void 0 : _a.medName) == 'Não verificada'; });
                const isEPCNotApplicable = !!risk.riskData.engsToRiskFactorData.find((e) => { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.recMed) === null || _a === void 0 ? void 0 : _a.medName) == 'Não aplicável'; });
                const isEPCNotImplemented = !!risk.riskData.engsToRiskFactorData.find((e) => { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.recMed) === null || _a === void 0 ? void 0 : _a.medName) == 'Não implementada'; });
                if (isEPCNotApplicable)
                    return event_2240_1.utileEpiEpcEnum.NOT_APT;
                if (isEPCNotImplemented)
                    return event_2240_1.utileEpiEpcEnum.NOT_IMPLEMENTED;
                if (isEPCPresent)
                    return event_2240_1.utileEpiEpcEnum.IMPLEMENTED;
                return null;
            };
            const getEpiType = (risk) => {
                const isEPINotApplicable = !!risk.riskData.epiToRiskFactorData.find((e) => { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.epi) === null || _a === void 0 ? void 0 : _a.ca) == '0'; });
                const isEPIPresent = !isEPINotApplicable && !!(risk.riskData.epiToRiskFactorData.length > 0);
                if (isEPINotApplicable)
                    return event_2240_1.utileEpiEpcEnum.NOT_APT;
                if (isEPIPresent)
                    return event_2240_1.utileEpiEpcEnum.IMPLEMENTED;
                return event_2240_1.utileEpiEpcEnum.NOT_IMPLEMENTED;
            };
            const comparePPP = employee.pppHistory.reduce((acc, ppp) => {
                return Object.assign(Object.assign({}, acc), { [ppp.doneDate.toISOString()]: { ppp, excluded: true } });
            }, {});
            let oldEventJs;
            const eventsJs = (0, sort_array_1.default)(employee.actualPPPHistory, { by: 'date', order: 'asc' }).map((snapshot) => {
                var _a, _b, _c, _d, _e, _f, _g;
                const risks = snapshot.risks;
                const responsible = snapshot.responsible;
                const environments = snapshot.environments;
                const date = snapshot.date;
                const id = generateId.newId();
                const eventRisk = {
                    infoExpRisco: {
                        dtIniCondicao: date,
                        infoAmb: environments.map((e) => ({
                            localAmb: e.isOwner ? event_2240_1.LocalAmbEnum.OWNER : event_2240_1.LocalAmbEnum.NOT_OWNER,
                            dscSetor: e.sectorName,
                            nrInsc: e.cnpj,
                        })),
                        infoAtiv: {
                            dscAtivDes: snapshot.desc,
                        },
                        agNoc: risks.map((risk) => {
                            var _a, _b, _c, _d;
                            const riskFactor = risk === null || risk === void 0 ? void 0 : risk.riskFactor;
                            const esocial = riskFactor === null || riskFactor === void 0 ? void 0 : riskFactor.esocial;
                            const code = esocial === null || esocial === void 0 ? void 0 : esocial.id;
                            const isEmptyRisk = event_2240_1.requiredTpAval.includes(code);
                            const isRequiredDesc = event_2240_1.requiredDescAg.includes(code);
                            const isRequiredLimit = event_2240_1.requiredLimTol.includes(code);
                            const isQuantity = esocial === null || esocial === void 0 ? void 0 : esocial.isQuantity;
                            const limit = ((_a = risk.riskData) === null || _a === void 0 ? void 0 : _a.ibtugLEO) || 100;
                            const intensity = ((_b = risk.riskData) === null || _b === void 0 ? void 0 : _b.vdvrValue) || ((_c = risk.riskData) === null || _c === void 0 ? void 0 : _c.arenValue) || ((_d = risk.riskData) === null || _d === void 0 ? void 0 : _d.intensity);
                            const useEpc = getEpcType(risk);
                            const useEpi = getEpiType(risk);
                            const isEPCEfficient = !!risk.riskData.engsToRiskFactorData.find((e) => e.efficientlyCheck);
                            const isEPIEfficient = !!risk.riskData.epiToRiskFactorData.find((e) => e.efficientlyCheck);
                            const isEPCImplemented = useEpc == event_2240_1.utileEpiEpcEnum.IMPLEMENTED;
                            const isEPIImplemented = useEpi == event_2240_1.utileEpiEpcEnum.IMPLEMENTED;
                            return Object.assign(Object.assign(Object.assign(Object.assign({ nameAgNoc: riskFactor.name, codAgNoc: code || undefined }, (isRequiredDesc && { dscAgNoc: riskFactor === null || riskFactor === void 0 ? void 0 : riskFactor.name })), (!isEmptyRisk && { tpAval: isQuantity ? event_2240_1.TpAvalEnum.QUANTITY : event_2240_1.TpAvalEnum.QUALITY })), (isQuantity && Object.assign(Object.assign({ intConc: intensity }, (isRequiredLimit && { limTol: limit || undefined })), { unMed: event_2240_1.UnMedEnum[riskFactor === null || riskFactor === void 0 ? void 0 : riskFactor.unit] || undefined, tecMedicao: (riskFactor === null || riskFactor === void 0 ? void 0 : riskFactor.method) != 'Qualitativo' ? riskFactor === null || riskFactor === void 0 ? void 0 : riskFactor.method : undefined }))), (!isEmptyRisk && {
                                epcEpi: Object.assign(Object.assign(Object.assign(Object.assign({ utilizEPC: getEpcType(risk) || undefined, utilizEPI: getEpiType(risk) || undefined }, (isEPCImplemented && { eficEpc: isEPCEfficient ? event_2240_1.YesNoEnum.YES : event_2240_1.YesNoEnum.NO })), (isEPIImplemented && { eficEpi: isEPIEfficient ? event_2240_1.YesNoEnum.YES : event_2240_1.YesNoEnum.NO })), (isEPIImplemented && { epi: risk.riskData.epiToRiskFactorData.map((e) => { var _a; return ({ docAval: ((_a = e === null || e === void 0 ? void 0 : e.epi) === null || _a === void 0 ? void 0 : _a.ca) || undefined }); }) })), (isEPIImplemented && {
                                    epiCompl: {
                                        condFuncto: isEPIEfficient ? event_2240_1.YesNoEnum.YES : event_2240_1.YesNoEnum.NO,
                                        higienizacao: isEPIEfficient ? event_2240_1.YesNoEnum.YES : event_2240_1.YesNoEnum.NO,
                                        medProtecao: isEPIEfficient ? event_2240_1.YesNoEnum.YES : event_2240_1.YesNoEnum.NO,
                                        periodicTroca: isEPIEfficient ? event_2240_1.YesNoEnum.YES : event_2240_1.YesNoEnum.NO,
                                        przValid: isEPIEfficient ? event_2240_1.YesNoEnum.YES : event_2240_1.YesNoEnum.NO,
                                        usoInint: isEPIEfficient ? event_2240_1.YesNoEnum.YES : event_2240_1.YesNoEnum.NO,
                                    },
                                })),
                            }));
                        }),
                        respReg: [
                            {
                                cpfResp: responsible === null || responsible === void 0 ? void 0 : responsible.cpf,
                                ideOC: esocial_1.IdeOCEnum.CREA,
                                nrOC: responsible === null || responsible === void 0 ? void 0 : responsible.councilId,
                                ufOC: responsible === null || responsible === void 0 ? void 0 : responsible.councilUF,
                            },
                        ],
                    },
                };
                const oldPPP = (_a = comparePPP[snapshot.date.toISOString()]) === null || _a === void 0 ? void 0 : _a.ppp;
                let receipt = '';
                let isSame = false;
                if (oldPPP) {
                    comparePPP[snapshot.date.toISOString()].excluded = false;
                    eventRisk.infoExpRisco.dtIniCondicao;
                    isSame = (0, deep_equal_1.default)((_b = oldPPP === null || oldPPP === void 0 ? void 0 : oldPPP.json) === null || _b === void 0 ? void 0 : _b.infoExpRisco, Object.assign(Object.assign({}, eventRisk.infoExpRisco), { dtIniCondicao: eventRisk.infoExpRisco.dtIniCondicao.toISOString() }));
                    receipt = (_e = (_d = (_c = oldPPP === null || oldPPP === void 0 ? void 0 : oldPPP.events) === null || _c === void 0 ? void 0 : _c.sort((b, a) => (0, data_sort_1.sortData)(a, b))) === null || _d === void 0 ? void 0 : _d.find((e) => e.receipt)) === null || _e === void 0 ? void 0 : _e.receipt;
                }
                if (oldEventJs && !isSame) {
                    const oldRisks = oldEventJs === null || oldEventJs === void 0 ? void 0 : oldEventJs.infoExpRisco;
                    isSame = (0, deep_equal_1.default)(Object.assign(Object.assign(Object.assign(Object.assign({}, oldRisks.agNoc), oldRisks.infoAmb), oldRisks.infoAtiv), oldRisks.respReg), Object.assign(Object.assign(Object.assign(Object.assign({}, eventRisk.infoExpRisco.agNoc), eventRisk.infoExpRisco.infoAmb), eventRisk.infoExpRisco.infoAtiv), eventRisk.infoExpRisco.respReg));
                }
                const event = {
                    id,
                    evtExpRisco: eventRisk,
                    ideEmpregador: { nrInsc: company.cnpj },
                    ideVinculo: {
                        cpfTrab: employee.cpf,
                        matricula: employee.esocialCode,
                    },
                    ideEvento: Object.assign({ tpAmb: (_f = options === null || options === void 0 ? void 0 : options.ideEvento) === null || _f === void 0 ? void 0 : _f.tpAmb, procEmi: (_g = options === null || options === void 0 ? void 0 : options.ideEvento) === null || _g === void 0 ? void 0 : _g.procEmi }, (receipt && {
                        indRetif: event_batch_2.IndRetifEnum.MODIFIED,
                        nrRecibo: receipt,
                    })),
                };
                delete employee.pppHistory;
                delete employee.actualPPPHistory;
                oldEventJs = event.evtExpRisco;
                return Object.assign({ id, event: event, employee: employee, eventDate: date, json: event.evtExpRisco, isSame }, (receipt && {
                    receipt,
                    ppp: oldPPP,
                }));
            });
            const excludedEvents = Object.values(comparePPP)
                .filter((compare) => compare.excluded)
                .map((compare) => {
                var _a, _b, _c, _d;
                const receipt = (_d = (_c = (_b = (_a = compare.ppp) === null || _a === void 0 ? void 0 : _a.events) === null || _b === void 0 ? void 0 : _b.sort((b, a) => (0, data_sort_1.sortData)(a, b))) === null || _c === void 0 ? void 0 : _c.find((e) => e.receipt)) === null || _d === void 0 ? void 0 : _d.receipt;
                if (!receipt)
                    return;
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
    convertToEvent3000Struct(props, options) {
        const generateId = this.eSocialMethodsProvider.classGenerateId(props.cnpj);
        const events = props.event.map((event) => {
            var _a, _b;
            const id = generateId.newId();
            const eventExclude = {
                id,
                infoExclusao: {
                    ideTrabalhador: { cpfTrab: event.cpf },
                    tpEvento: event_3000_1.mapTpEvent[event.eventType],
                    nrRecEvt: event.receipt,
                },
                ideEmpregador: { nrInsc: props.cnpj },
                ideEvento: {
                    tpAmb: (_a = options === null || options === void 0 ? void 0 : options.ideEvento) === null || _a === void 0 ? void 0 : _a.tpAmb,
                    procEmi: (_b = options === null || options === void 0 ? void 0 : options.ideEvento) === null || _b === void 0 ? void 0 : _b.procEmi,
                },
            };
            return Object.assign(Object.assign({}, event), { event: eventExclude, id });
        });
        return events;
    }
    generateXmlEvent2220(event, options) {
        const baseEvent = this.generateEventBase(event);
        const exMedOcup = event.exMedOcup;
        const respMonit = exMedOcup.respMonit;
        const aso = exMedOcup.aso;
        const asoDoctor = aso.medico;
        const exams = aso.exame;
        const eventJs = Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.declarations) && {
            _declaration: {
                _attributes: {
                    version: '1.0',
                    encoding: 'UTF-8',
                },
            },
        })), { eSocial: {
                ['_attributes']: {
                    xmlns: 'http://www.esocial.gov.br/schema/evt/evtMonit/v_S_01_00_00',
                },
                evtMonit: Object.assign(Object.assign({ ['_attributes']: {
                        Id: event.id,
                    } }, baseEvent), { exMedOcup: {
                        tpExameOcup: { ['_text']: exMedOcup.tpExameOcup },
                        aso: {
                            dtAso: {
                                ['_text']: this.convertDate(aso.dtAso),
                            },
                            resAso: { ['_text']: aso.resAso },
                            exame: exams.map((exam) => (Object.assign(Object.assign(Object.assign({ dtExm: { ['_text']: this.convertDate(exam.dtExm) }, procRealizado: { ['_text']: exam.procRealizado } }, (exam.ordExame && { ['_text']: exam.ordExame })), (exam.obsProc && { ['_text']: exam.obsProc })), (exam.indResult && { ['_text']: exam.indResult })))),
                            medico: {
                                nmMed: { ['_text']: asoDoctor.nmMed },
                                nrCRM: { ['_text']: asoDoctor.nrCRM },
                                ufCRM: { ['_text']: asoDoctor.ufCRM },
                            },
                        },
                        respMonit: {
                            nmResp: { ['_text']: respMonit.nmResp },
                            nrCRM: { ['_text']: respMonit.nrCRM },
                            ufCRM: { ['_text']: respMonit.ufCRM },
                        },
                    } }),
            } });
        const xml = (0, xml_js_1.js2xml)(eventJs, { compact: true });
        return xml;
    }
    generateXmlEvent2240(event, options) {
        if (!event)
            return '';
        const baseEvent = this.generateEventBase(event);
        const infoExpRisco = event.evtExpRisco.infoExpRisco;
        const respReg = infoExpRisco.respReg;
        const dscAtivDes = infoExpRisco.infoAtiv.dscAtivDes;
        const infoAmb = infoExpRisco.infoAmb;
        const agNoc = infoExpRisco.agNoc;
        const eventJs = Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.declarations) && {
            _declaration: {
                _attributes: {
                    version: '1.0',
                    encoding: 'UTF-8',
                },
            },
        })), { eSocial: {
                ['_attributes']: {
                    xmlns: 'http://www.esocial.gov.br/schema/evt/evtExpRisco/v_S_01_00_00',
                },
                evtExpRisco: Object.assign(Object.assign({ ['_attributes']: {
                        Id: event.id,
                    } }, baseEvent), { infoExpRisco: {
                        dtIniCondicao: { ['_text']: this.convertDate(infoExpRisco.dtIniCondicao) },
                        infoAmb: infoAmb.map((amb) => ({
                            localAmb: { ['_text']: amb.localAmb },
                            dscSetor: { ['_text']: amb.dscSetor },
                            tpInsc: { ['_text']: event_2240_1.TpInscEnum.CNPJ },
                            nrInsc: { ['_text']: amb.nrInsc },
                        })),
                        infoAtiv: {
                            dscAtivDes: { ['_text']: dscAtivDes },
                        },
                        agNoc: agNoc.map((ag) => {
                            const code = ag.codAgNoc;
                            const isEmptyRisk = event_2240_1.requiredTpAval.includes(code);
                            const isRequiredDesc = event_2240_1.requiredDescAg.includes(code);
                            const isRequiredLimit = event_2240_1.requiredLimTol.includes(code);
                            const isQuantity = (ag === null || ag === void 0 ? void 0 : ag.tpAval) === event_2240_1.TpAvalEnum.QUANTITY;
                            const epcEpi = ag === null || ag === void 0 ? void 0 : ag.epcEpi;
                            const isEPCImplemented = (epcEpi === null || epcEpi === void 0 ? void 0 : epcEpi.utilizEPC) == event_2240_1.utileEpiEpcEnum.IMPLEMENTED;
                            const isEPIImplemented = (epcEpi === null || epcEpi === void 0 ? void 0 : epcEpi.utilizEPI) == event_2240_1.utileEpiEpcEnum.IMPLEMENTED;
                            return Object.assign(Object.assign(Object.assign(Object.assign({ codAgNoc: code || undefined }, (isRequiredDesc && { dscAgNoc: { ['_text']: ag.dscAgNoc } })), (!isEmptyRisk && { tpAval: { ['_text']: ag.tpAval } })), (isQuantity && Object.assign(Object.assign({ intConc: { ['_text']: ag.intConc } }, (isRequiredLimit && { limTol: { ['_text']: ag.limTol } })), { unMed: { ['_text']: ag.unMed }, tecMedicao: { ['_text']: ag.tecMedicao } }))), (!isEmptyRisk && {
                                epcEpi: Object.assign(Object.assign(Object.assign(Object.assign({ utilizEPC: { ['_text']: epcEpi === null || epcEpi === void 0 ? void 0 : epcEpi.utilizEPC }, utilizEPI: { ['_text']: epcEpi === null || epcEpi === void 0 ? void 0 : epcEpi.utilizEPI } }, (isEPCImplemented && { eficEpc: { ['_text']: epcEpi === null || epcEpi === void 0 ? void 0 : epcEpi.eficEpc } })), (isEPIImplemented && { eficEpi: { ['_text']: epcEpi === null || epcEpi === void 0 ? void 0 : epcEpi.eficEpi } })), (isEPIImplemented && { epi: epcEpi === null || epcEpi === void 0 ? void 0 : epcEpi.epi.map((e) => ({ docAval: { ['_text']: e.docAval } })) })), (isEPIImplemented && {
                                    epiCompl: {
                                        condFuncto: { ['_text']: epcEpi.epiCompl.condFuncto },
                                        higienizacao: { ['_text']: epcEpi.epiCompl.higienizacao },
                                        medProtecao: { ['_text']: epcEpi.epiCompl.medProtecao },
                                        periodicTroca: { ['_text']: epcEpi.epiCompl.periodicTroca },
                                        przValid: { ['_text']: epcEpi.epiCompl.przValid },
                                        usoInint: { ['_text']: epcEpi.epiCompl.usoInint },
                                    },
                                })),
                            }));
                        }),
                        respReg: respReg.map((resp) => (Object.assign(Object.assign({ cpfResp: { ['_text']: resp.cpfResp }, ideOC: { ['_text']: resp.ideOC } }, (resp.dscOC && { dscOC: { ['_text']: resp.dscOC } })), { nrOC: { ['_text']: resp.nrOC }, ufOC: { ['_text']: resp.ufOC } }))),
                    } }),
            } });
        const xml = (0, xml_js_1.js2xml)(eventJs, { compact: true });
        return xml;
    }
    generateXmlEvent3000(event, options) {
        var _a;
        const baseEvent = this.generateEventBase(event);
        const infoExclusao = event === null || event === void 0 ? void 0 : event.infoExclusao;
        const eventJs = Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.declarations) && {
            _declaration: {
                _attributes: {
                    version: '1.0',
                    encoding: 'UTF-8',
                },
            },
        })), { eSocial: {
                ['_attributes']: {
                    xmlns: 'http://www.esocial.gov.br/schema/evt/evtExclusao/v_S_01_00_00',
                },
                evtExclusao: Object.assign(Object.assign({ ['_attributes']: {
                        Id: event.id,
                    } }, baseEvent), { infoExclusao: {
                        tpExameOcup: { ['_text']: infoExclusao === null || infoExclusao === void 0 ? void 0 : infoExclusao.tpEvento },
                        nrRecEvt: { ['_text']: infoExclusao === null || infoExclusao === void 0 ? void 0 : infoExclusao.nrRecEvt },
                        ideTrabalhador: {
                            cpfTrab: { ['_text']: (_a = infoExclusao.ideTrabalhador) === null || _a === void 0 ? void 0 : _a.cpfTrab },
                        },
                    } }),
            } });
        const xml = (0, xml_js_1.js2xml)(eventJs, { compact: true });
        return xml;
    }
    generateEventBase(event) {
        const eventJs = Object.assign(Object.assign(Object.assign({}, ((event === null || event === void 0 ? void 0 : event.ideEvento) && {
            ideEvento: Object.assign({ indRetif: {
                    ['_text']: event.ideEvento.indRetif || this.indRetif,
                }, tpAmb: {
                    ['_text']: event.ideEvento.tpAmb || this.tpAmb,
                }, procEmi: {
                    ['_text']: event.ideEvento.procEmi || this.procEmi,
                }, verProc: {
                    ['_text']: this.verProc,
                } }, (event.ideEvento.nrRecibo && {
                nrRecibo: {
                    ['_text']: event.ideEvento.nrRecibo,
                },
            })),
        })), { ideEmpregador: {
                tpInsc: {
                    ['_text']: event.ideEmpregador.tpInsc || this.tpInsc,
                },
                nrInsc: {
                    ['_text']: event.ideEmpregador.nrInsc,
                },
            } }), ((event === null || event === void 0 ? void 0 : event.ideVinculo) && {
            ideVinculo: {
                cpfTrab: {
                    ['_text']: event.ideVinculo.cpfTrab,
                },
                matricula: {
                    ['_text']: event.ideVinculo.matricula,
                },
            },
        }));
        return eventJs;
    }
    generateBatchXML(events, event) {
        const xmlEvents = events.map((event) => `<evento Id="${event.id}">${event.signedXml}</evento>`).join('');
        const replaceText = 'xml_replace_data';
        const eventJs = {
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
        const xml = (0, xml_js_1.js2xml)(eventJs, { compact: true }).replace(replaceText, xmlEvents).replace('<?xml version="1.0" encoding="UTF-8"?>', '');
        return xml;
    }
    generateFetchBatchXML(protocolId) {
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
        const xml = (0, xml_js_1.js2xml)(eventJs, { compact: true });
        return xml;
    }
    async sendEventToESocial(events, options) {
        const tpAmb = (options === null || options === void 0 ? void 0 : options.environment) || this.tpAmb;
        const eventChunks = (0, arrayChunks_1.arrayChunks)(events, 40);
        const responseBatchEvents = await Promise.all(eventChunks.map(async (events) => {
            var _a;
            const batchXML = this.generateBatchXML(events, {
                eventGroup: 2,
                ideEmpregador: { nrInsc: (_a = options.company) === null || _a === void 0 ? void 0 : _a.cnpj },
            });
            const client = tpAmb == event_batch_2.TpAmbEnum.PROD ? this.clientProduction : this.clientRestrict;
            const sendEventBatch = new Promise((resolve) => {
                client.ServicoEnviarLoteEventos.WsEnviarLoteEventos.EnviarLoteEventos(batchXML, (e, s) => {
                    var _a, _b, _c;
                    if (e)
                        return resolve({
                            status: {
                                cdResposta: '500',
                                descResposta: ((_a = e === null || e === void 0 ? void 0 : e.message) === null || _a === void 0 ? void 0 : _a.slice(0, 200)) + '...',
                            },
                        });
                    if (!((_c = (_b = s === null || s === void 0 ? void 0 : s.EnviarLoteEventosResult) === null || _b === void 0 ? void 0 : _b.eSocial) === null || _c === void 0 ? void 0 : _c.retornoEnvioLoteEventos))
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
        }));
        return responseBatchEvents;
    }
    async sendExclusionToESocial(props) {
        var _a;
        if (props.events.length === 0)
            return;
        const company = props.company;
        const cert = props.cert;
        const esocialSend = props.esocialSend;
        const excludeStruct = this.convertToEvent3000Struct({
            cnpj: company.cnpj,
            event: props.events.map((event) => {
                return {
                    cpf: event.employee.cpf,
                    eventType: event === null || event === void 0 ? void 0 : event.eventType,
                    receipt: event === null || event === void 0 ? void 0 : event.receipt,
                    employee: event.employee,
                    aso: event.aso,
                    ppp: event.ppp,
                };
            }),
        });
        const eventsExcludeXml = excludeStruct
            .map((_a) => {
            var { event } = _a, data = __rest(_a, ["event"]);
            const errors = this.errorsEvent3000(event);
            if (errors.length > 0)
                return;
            const xmlResult = this.generateXmlEvent3000(event);
            const signedXml = esocialSend
                ? this.eSocialMethodsProvider.signEvent({
                    xml: xmlResult,
                    cert: cert,
                })
                : '';
            return Object.assign({ signedXml, xml: xmlResult }, data);
        })
            .filter((i) => i);
        const sendEventResponse = esocialSend
            ? await this.sendEventToESocial(eventsExcludeXml, {
                company: company,
                environment: (_a = props.body) === null || _a === void 0 ? void 0 : _a.tpAmb,
            })
            : [
                {
                    events: eventsExcludeXml,
                    response: {
                        status: { cdResposta: '201' },
                    },
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
    async saveDatabaseBatchEvent(props) {
        const sendEvents = props.sendEvents;
        const companyId = props.company.id;
        const body = props.body;
        const esocialSend = props.esocialSend;
        const user = props.user;
        const type = props.type;
        await Promise.all(sendEvents.map(async (resp) => {
            var _a, _b, _c, _d;
            const examsIds = [];
            const pppJson = [];
            const respEvents = resp.events;
            const isOk = ['201', '202'].includes((_b = (_a = resp.response) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.cdResposta);
            const events = isOk
                ? respEvents.map((_a) => {
                    var _b, _c;
                    var event = __rest(_a, []);
                    if ('examIds' in event) {
                        examsIds.push(...event.examIds);
                    }
                    let action = client_1.EmployeeESocialEventActionEnum.SEND;
                    if (event.xml.includes('infoExclusao')) {
                        action = client_1.EmployeeESocialEventActionEnum.EXCLUDE;
                    }
                    if (event.xml.includes('<indRetif>2</indRetif>')) {
                        action = client_1.EmployeeESocialEventActionEnum.MODIFY;
                    }
                    if ('json' in event) {
                        if (action != client_1.EmployeeESocialEventActionEnum.EXCLUDE)
                            pppJson.push({ json: event.json, event });
                    }
                    return Object.assign(Object.assign(Object.assign({ employeeId: event.employee.id, eventXml: event.xml, eventId: event.id, action }, ('eventDate' in event && {
                        eventsDate: event === null || event === void 0 ? void 0 : event.eventDate,
                    })), ('aso' in event && {
                        examHistoryId: (_b = event === null || event === void 0 ? void 0 : event.aso) === null || _b === void 0 ? void 0 : _b.id,
                    })), ('ppp' in event && {
                        pppId: (_c = event === null || event === void 0 ? void 0 : event.ppp) === null || _c === void 0 ? void 0 : _c.id,
                    }));
                })
                : [];
            await this.eSocialBatchRepository.create({
                companyId,
                environment: (body === null || body === void 0 ? void 0 : body.tpAmb) || 1,
                status: esocialSend ? (isOk ? client_1.StatusEnum.DONE : client_1.StatusEnum.INVALID) : client_1.StatusEnum.TRANSMITTED,
                type,
                userTransmissionId: user.userId,
                events,
                pppJson,
                examsIds,
                protocolId: (_d = (_c = resp.response) === null || _c === void 0 ? void 0 : _c.dadosRecepcaoLote) === null || _d === void 0 ? void 0 : _d.protocoloEnvio,
                response: resp.response,
            });
        }));
    }
    async fetchEventToESocial(batch) {
        var _a, _b;
        const protocolId = batch.protocolId || ((_b = (_a = batch.response) === null || _a === void 0 ? void 0 : _a.dadosRecepcaoLote) === null || _b === void 0 ? void 0 : _b.protocoloEnvio);
        const XML = this.generateFetchBatchXML(protocolId);
        const tpAmb = batch.environment || this.tpAmb;
        const client = tpAmb == event_batch_2.TpAmbEnum.PROD ? this.clientConsultProduction : this.clientConsultRestrict;
        const fetchEventBatch = new Promise((resolve) => {
            client.ServicoConsultarLoteEventos['Servicos.Empregador_ServicoConsultarLoteEventos'].ConsultarLoteEventos(XML, (e, s) => {
                var _a, _b, _c;
                if (e)
                    return resolve({
                        status: {
                            cdResposta: '500',
                            descResposta: ((_a = e === null || e === void 0 ? void 0 : e.message) === null || _a === void 0 ? void 0 : _a.slice(0, 200)) + '...',
                        },
                    });
                if (!((_c = (_b = s === null || s === void 0 ? void 0 : s.ConsultarLoteEventosResult) === null || _b === void 0 ? void 0 : _b.eSocial) === null || _c === void 0 ? void 0 : _c.retornoProcessamentoLoteEventos))
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
};
ESocialEventProvider = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(soapClient_1.SoapClientEnum.PRODUCTION)),
    __param(1, (0, common_1.Inject)(soapClient_1.SoapClientEnum.PRODUCTION_RESTRICT)),
    __param(2, (0, common_1.Inject)(soapClient_1.SoapClientEnum.CONSULT_PRODUCTION)),
    __param(3, (0, common_1.Inject)(soapClient_1.SoapClientEnum.CONSULT_PRODUCTION_RESTRICT)),
    __metadata("design:paramtypes", [nestjs_soap_1.Client,
        nestjs_soap_1.Client,
        nestjs_soap_1.Client,
        nestjs_soap_1.Client,
        prisma_service_1.PrismaService,
        ESocialBatchRepository_1.ESocialBatchRepository,
        DayJSProvider_1.DayJSProvider,
        ESocialMethodsProvider_1.ESocialMethodsProvider])
], ESocialEventProvider);
exports.ESocialEventProvider = ESocialEventProvider;
//# sourceMappingURL=ESocialEventProvider.js.map