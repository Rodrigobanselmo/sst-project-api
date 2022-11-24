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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const openapi = require("@nestjs/swagger");
const user_payload_dto_1 = require("./../../../shared/dto/user-payload.dto");
const user_decorator_1 = require("../../../shared/decorators/user.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const send_email_service_1 = require("../services/send-email.service");
const email_dto_1 = require("../dto/email.dto");
const nofication_dto_1 = require("../dto/nofication.dto");
const list_notification_service_1 = require("../services/list-notification.service");
const create_notification_service_1 = require("../services/create-notification.service");
const list_company_notification_service_1 = require("../services/list-company-notification.service");
const roles_decorator_1 = require("../../../shared/decorators/roles.decorator");
const authorization_1 = require("../../../shared/constants/enum/authorization");
const update_user_notification_service_1 = require("../services/update-user-notification.service");
let NotificationController = class NotificationController {
    constructor(sendEmailService, listNotificationService, createNotificationService, listCompanyNotificationService, updateUserNotificationService) {
        this.sendEmailService = sendEmailService;
        this.listNotificationService = listNotificationService;
        this.createNotificationService = createNotificationService;
        this.listCompanyNotificationService = listCompanyNotificationService;
        this.updateUserNotificationService = updateUserNotificationService;
    }
    sendNotification(user, dto) {
        return this.createNotificationService.execute(user, dto);
    }
    sendEmail(user, dto, files) {
        return this.sendEmailService.execute(user, dto, files);
    }
    updateUser(user, dto, id) {
        return this.updateUserNotificationService.execute(user, Object.assign(Object.assign({}, dto), { id }));
    }
    listNotification(user, query) {
        return this.listNotificationService.execute(user, query);
    }
    listCompanyNotification(user, query) {
        return this.listCompanyNotificationService.execute(user, query);
    }
};
__decorate([
    (0, roles_decorator_1.Roles)(authorization_1.RoleEnum.NOTIFICATION),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../entities/notification.entity").NotificationEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, nofication_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Post)('email'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files[]', 5)),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, email_dto_1.EmailDto, Array]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Patch)(':id/user'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, nofication_dto_1.UpdateUserNotificationDto, Number]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, nofication_dto_1.FindNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "listNotification", null);
__decorate([
    (0, roles_decorator_1.Roles)(authorization_1.RoleEnum.NOTIFICATION),
    (0, common_1.Get)('company'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, nofication_dto_1.FindNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "listCompanyNotification", null);
NotificationController = __decorate([
    (0, swagger_1.ApiTags)('notification'),
    (0, common_1.Controller)('notification'),
    __metadata("design:paramtypes", [send_email_service_1.SendEmailService,
        list_notification_service_1.ListNotificationService,
        create_notification_service_1.CreateNotificationService,
        list_company_notification_service_1.ListCompanyNotificationService,
        update_user_notification_service_1.UpdateUserNotificationService])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map