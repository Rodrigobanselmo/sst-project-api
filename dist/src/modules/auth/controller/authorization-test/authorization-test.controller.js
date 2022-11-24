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
exports.AuthorizationTestController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
let AuthorizationTestController = class AuthorizationTestController {
    route1() {
        return true;
    }
    route2() {
        return true;
    }
    route21() {
        return true;
    }
    route3() {
        return true;
    }
    route4() {
        return true;
    }
    route6() {
        return true;
    }
    route7() {
        return true;
    }
    route8() {
        return true;
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.USER,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.USER,
    }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthorizationTestController.prototype, "route1", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.USER,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.USER,
        isMember: true,
    }, {
        code: authorization_1.PermissionEnum.DOCUMENTS,
        crud: true,
        isMember: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthorizationTestController.prototype, "route2", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.DOCUMENTS,
        crud: true,
        isMember: true,
    }),
    (0, common_1.Post)('2'),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthorizationTestController.prototype, "route21", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.USER,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.USER,
        crud: true,
        isMember: true,
        isContract: true,
    }, {
        code: authorization_1.PermissionEnum.DOCUMENTS,
        crud: true,
        isContract: true,
    }),
    (0, common_1.Patch)(),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthorizationTestController.prototype, "route3", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.USER,
        crud: true,
    }),
    (0, common_1.Delete)(),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthorizationTestController.prototype, "route4", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        isMember: true,
    }),
    (0, common_1.Get)('6'),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthorizationTestController.prototype, "route6", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        isContract: true,
    }),
    (0, common_1.Get)('7'),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthorizationTestController.prototype, "route7", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.DOCUMENTS,
        isContract: true,
    }),
    (0, common_1.Get)('8'),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthorizationTestController.prototype, "route8", null);
AuthorizationTestController = __decorate([
    (0, common_1.Controller)('authorization-test')
], AuthorizationTestController);
exports.AuthorizationTestController = AuthorizationTestController;
//# sourceMappingURL=authorization-test.controller.js.map