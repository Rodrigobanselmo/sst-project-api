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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindEmployeeExamHistoryService = void 0;
const common_1 = require("@nestjs/common");
const EmployeeExamsHistoryRepository_1 = require("../../../../../repositories/implementations/EmployeeExamsHistoryRepository");
let FindEmployeeExamHistoryService = class FindEmployeeExamHistoryService {
    constructor(employeeExamHistoryRepository) {
        this.employeeExamHistoryRepository = employeeExamHistoryRepository;
    }
    async execute(_a, user) {
        var { skip, take, includeClinic, orderByCreation } = _a, query = __rest(_a, ["skip", "take", "includeClinic", "orderByCreation"]);
        const access = await this.employeeExamHistoryRepository.find(Object.assign({ companyId: user.targetCompanyId }, query), { skip, take }, Object.assign({ include: Object.assign(Object.assign({ exam: {
                    select: {
                        isAttendance: true,
                        id: true,
                        name: true,
                    },
                }, userDone: { select: { email: true, name: true } }, userSchedule: { select: { email: true, name: true } } }, (!query.employeeId && {
                employee: {
                    select: Object.assign({ email: true, name: true, id: true, phone: true, cpf: true, companyId: true }, (query.allCompanies && {
                        company: {
                            select: {
                                cnpj: true,
                                name: true,
                                id: true,
                                fantasy: true,
                                initials: true,
                            },
                        },
                    })),
                },
            })), (includeClinic && {
                clinic: { select: { id: true, fantasy: true, address: true } },
            })) }, (orderByCreation && {
            orderBy: { created_at: 'desc' },
        })));
        return access;
    }
};
FindEmployeeExamHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository])
], FindEmployeeExamHistoryService);
exports.FindEmployeeExamHistoryService = FindEmployeeExamHistoryService;
//# sourceMappingURL=find.service.js.map