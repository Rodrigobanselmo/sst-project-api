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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCompanyService = void 0;
const common_1 = require("@nestjs/common");
const workspace_dto_1 = require("../../../dto/workspace.dto");
const WorkspaceRepository_1 = require("../../../repositories/implementations/WorkspaceRepository");
const CompanyRepository_1 = require("../../../repositories/implementations/CompanyRepository");
let UpdateCompanyService = class UpdateCompanyService {
    constructor(companyRepository, workspaceRepository) {
        this.companyRepository = companyRepository;
        this.workspaceRepository = workspaceRepository;
    }
    async execute(updateCompanyDto) {
        console.log(updateCompanyDto);
        const newWorkspaces = [];
        if (updateCompanyDto.workspace && updateCompanyDto.workspace.length > 0) {
            const workspaces = await this.workspaceRepository.findByCompany(updateCompanyDto.companyId);
            updateCompanyDto.workspace.forEach(async (workspace) => {
                const loop = (abr, count = 0) => {
                    const found = workspaces.find((w) => w.abbreviation === abr && w.id !== workspace.id);
                    if (!found) {
                        return abr;
                    }
                    return loop(abr.split('-')[0] + (count ? '-' + String(count) : ''), count + 1);
                };
                let abr = workspace.name
                    .replace(/[^0-9a-zA-Z\s]/g, '')
                    .split(' ')
                    .slice(0, 2)
                    .map((el) => el[0])
                    .join('');
                const abrWorkspace = abr.length > 1 ? abr : abr + workspace.name.slice(1, 2).toUpperCase();
                console.log(abrWorkspace);
                abr = loop(abrWorkspace);
                newWorkspaces.push(Object.assign(Object.assign({}, workspace), { abbreviation: abr }));
            });
        }
        const company = await this.companyRepository.update(Object.assign(Object.assign({}, updateCompanyDto), { workspace: newWorkspaces }), {
            include: {
                license: true,
                workspace: true,
                primary_activity: true,
                users: true,
                secondary_activity: true,
            },
        });
        return company;
    }
};
UpdateCompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CompanyRepository_1.CompanyRepository,
        WorkspaceRepository_1.WorkspaceRepository])
], UpdateCompanyService);
exports.UpdateCompanyService = UpdateCompanyService;
//# sourceMappingURL=update-company.service.js.map