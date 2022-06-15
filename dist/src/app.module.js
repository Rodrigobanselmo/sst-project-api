"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./modules/auth/auth.module");
const checklist_module_1 = require("./modules/checklist/checklist.module");
const company_module_1 = require("./modules/company/company.module");
const documents_module_1 = require("./modules/documents/documents.module");
const files_module_1 = require("./modules/files/files.module");
const users_module_1 = require("./modules/users/users.module");
const prisma_module_1 = require("./prisma/prisma.module");
const jwt_auth_guard_1 = require("./shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("./shared/guards/permissions.guard");
const roles_guard_1 = require("./shared/guards/roles.guard");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            company_module_1.CompanyModule,
            checklist_module_1.ChecklistModule,
            files_module_1.FilesModule,
            documents_module_1.DocumentsModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: permissions_guard_1.PermissionsGuard,
            },
        ],
        controllers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map