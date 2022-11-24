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
exports.UpdateUserNotificationService = void 0;
const common_1 = require("@nestjs/common");
const NotificationRepository_1 = require("../repositories/implementations/NotificationRepository");
let UpdateUserNotificationService = class UpdateUserNotificationService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(user, dto) {
        if (dto.id) {
            const notification = await this.notificationRepository.confirm(Object.assign(Object.assign({}, dto), { userId: user.userId }));
            return notification;
        }
        if (dto.ids) {
            const notification = await this.notificationRepository.confirmMany(Object.assign(Object.assign({}, dto), { userId: user.userId }));
            return notification;
        }
    }
};
UpdateUserNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [NotificationRepository_1.NotificationRepository])
], UpdateUserNotificationService);
exports.UpdateUserNotificationService = UpdateUserNotificationService;
//# sourceMappingURL=update-user-notification.service.js.map