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
exports.UploadEmployeesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const CompanyRepository_1 = require("../../../../company/repositories/implementations/CompanyRepository");
const HierarchyRepository_1 = require("../../../../company/repositories/implementations/HierarchyRepository");
const HierarchyExcelProvider_1 = require("../../../providers/HierarchyExcelProvider");
const uploadExcelProvider_1 = require("../../../providers/uploadExcelProvider");
const findAllEmployees_1 = require("../../../utils/findAllEmployees");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const workbooks_constant_1 = require("../../../../../shared/constants/workbooks/workbooks.constant");
const workbooks_enum_1 = require("../../../../../shared/constants/workbooks/workbooks.enum");
const ExcelProvider_1 = require("../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const asyncEach_1 = require("../../../../../shared/utils/asyncEach");
const DatabaseTableRepository_1 = require("../../../repositories/implementations/DatabaseTableRepository");
const WorkspaceRepository_1 = require("../../../../../modules/company/repositories/implementations/WorkspaceRepository");
let UploadEmployeesService = class UploadEmployeesService {
    constructor(excelProvider, companyRepository, workspaceRepository, databaseTableRepository, uploadExcelProvider, hierarchyRepository) {
        this.excelProvider = excelProvider;
        this.companyRepository = companyRepository;
        this.workspaceRepository = workspaceRepository;
        this.databaseTableRepository = databaseTableRepository;
        this.uploadExcelProvider = uploadExcelProvider;
        this.hierarchyRepository = hierarchyRepository;
    }
    async execute(file, userPayloadDto) {
        if (!file)
            throw new common_1.BadRequestException(`file is not available`);
        const buffer = file.buffer;
        const hierarchyExcel = new HierarchyExcelProvider_1.HierarchyExcelProvider();
        const Workbook = workbooks_constant_1.workbooksConstant[workbooks_enum_1.WorkbooksEnum.EMPLOYEES];
        const system = userPayloadDto.isMaster;
        const companyId = userPayloadDto.targetCompanyId;
        const DatabaseTable = await this.databaseTableRepository.findByNameAndCompany(Workbook.name, companyId);
        let employeesData = await this.uploadExcelProvider.getAllData({
            buffer,
            Workbook,
            read,
            DatabaseTable,
        });
        return;
        const workspaces = await this.workspaceRepository.findByCompany(companyId);
        const ghoNameDescriptionMap = {};
        employeesData = employeesData.map((employee) => {
            const workspace = workspaces.filter((work) => employee.abbreviation &&
                employee.abbreviation.includes(work.abbreviation));
            if (!workspace)
                throw new common_1.BadRequestException(errorMessage_1.ErrorCompanyEnum.WORKSPACE_NOT_FOUND);
            if (employee.ghoName) {
                ghoNameDescriptionMap[employee.ghoName] =
                    ghoNameDescriptionMap[employee.ghoName] ||
                        employee.ghoDescription ||
                        '';
            }
            delete employee.abbreviation;
            return Object.assign(Object.assign({}, employee), { workspaceIds: workspace.map((work) => work.id) });
        });
        const allHierarchyTree = hierarchyExcel.transformArrayToHierarchyMapTree(await this.hierarchyRepository.findAllHierarchyByCompany(companyId, {
            include: { workspaces: true },
        }));
        const sheetHierarchyTree = hierarchyExcel.createTreeMapFromHierarchyStruct(employeesData);
        const hierarchyTree = hierarchyExcel.compare(allHierarchyTree, sheetHierarchyTree);
        const hierarchyArray = Object.values(hierarchyTree)
            .filter((hierarchy) => !hierarchy.refId)
            .map((_a) => {
            var { connectedToOldId, children, fromOld, type } = _a, hierarchy = __rest(_a, ["connectedToOldId", "children", "fromOld", "type"]);
            return (Object.assign(Object.assign({}, hierarchy), { type: type, ghoName: type == client_1.HierarchyEnum.OFFICE ? hierarchy.ghoName : '' }));
        });
        const upsertHierarchy = async (type) => {
            await this.hierarchyRepository.upsertMany(hierarchyArray.filter((hy) => hy.type === type), companyId, ghoNameDescriptionMap);
        };
        await (0, asyncEach_1.asyncEach)(Object.keys(client_1.HierarchyEnum), upsertHierarchy);
        const employees = employeesData.map((employee) => {
            const newEmployee = Object.assign({}, employee);
            let hierarchy = null;
            const getByNameHierarchy = () => {
                Object.keys(client_1.HierarchyEnum).forEach((key) => {
                    const hierarchyName = newEmployee[key.toLocaleLowerCase()];
                    delete newEmployee[key.toLocaleLowerCase()];
                    if (hierarchyName) {
                        const children = hierarchy
                            ? hierarchy.children.map((child) => hierarchyTree[child])
                            : Object.values(hierarchyTree);
                        const actualHierarchy = children.find((h) => (h === null || h === void 0 ? void 0 : h.name) &&
                            (h === null || h === void 0 ? void 0 : h.type) &&
                            h.name === hierarchyName &&
                            h.type === key);
                        if (actualHierarchy) {
                            hierarchy = actualHierarchy;
                            newEmployee.hierarchyId = actualHierarchy.id;
                        }
                    }
                });
            };
            getByNameHierarchy();
            return newEmployee;
        });
        await this.companyRepository.update({
            companyId,
            employees,
            users: [],
        });
        return await this.uploadExcelProvider.newTableData({
            findAll: (sheet) => (0, findAllEmployees_1.findAllEmployees)(this.excelProvider, this.companyRepository, this.workspaceRepository, this.hierarchyRepository, sheet, companyId),
            Workbook,
            system,
            companyId,
            DatabaseTable,
        });
    }
};
UploadEmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExcelProvider_1.ExcelProvider,
        CompanyRepository_1.CompanyRepository,
        WorkspaceRepository_1.WorkspaceRepository,
        DatabaseTableRepository_1.DatabaseTableRepository,
        uploadExcelProvider_1.UploadExcelProvider,
        HierarchyRepository_1.HierarchyRepository])
], UploadEmployeesService);
exports.UploadEmployeesService = UploadEmployeesService;
const read = async (readFileData, excelProvider, sheet, databaseTable) => {
    const table = readFileData.find((data) => data.name === sheet.name);
    if (!table)
        throw new common_1.BadRequestException('The table you trying to insert has a different sheet name');
    const database = await excelProvider.transformToTableData(table, sheet.columns);
    if ((databaseTable === null || databaseTable === void 0 ? void 0 : databaseTable.version) && database.version !== databaseTable.version)
        throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.FILE_WRONG_TABLE_HEAD);
    return database.rows;
};
//# sourceMappingURL=upload-employees.service.js.map