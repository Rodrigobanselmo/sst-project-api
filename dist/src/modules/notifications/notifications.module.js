"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const SendGridProvider_1 = require("../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider");
const sst_module_1 = require("../sst/sst.module");
const company_module_1 = require("../company/company.module");
const notification_controller_1 = require("./controller/notification.controller");
const NotificationRepository_1 = require("./repositories/implementations/NotificationRepository");
const create_notification_service_1 = require("./services/create-notification.service");
const list_company_notification_service_1 = require("./services/list-company-notification.service");
const list_notification_service_1 = require("./services/list-notification.service");
const send_email_service_1 = require("./services/send-email.service");
const update_user_notification_service_1 = require("./services/update-user-notification.service");
let NotificationModule = class NotificationModule {
};
NotificationModule = __decorate([
    (0, common_1.Module)({
        controllers: [notification_controller_1.NotificationController],
        imports: [(0, common_1.forwardRef)(() => company_module_1.CompanyModule), (0, common_1.forwardRef)(() => sst_module_1.SSTModule)],
        exports: [NotificationRepository_1.NotificationRepository],
        providers: [
            send_email_service_1.SendEmailService,
            SendGridProvider_1.SendGridProvider,
            NotificationRepository_1.NotificationRepository,
            create_notification_service_1.CreateNotificationService,
            list_notification_service_1.ListNotificationService,
            list_company_notification_service_1.ListCompanyNotificationService,
            update_user_notification_service_1.UpdateUserNotificationService,
        ],
    })
], NotificationModule);
exports.NotificationModule = NotificationModule;
//# sourceMappingURL=notifications.module.js.map