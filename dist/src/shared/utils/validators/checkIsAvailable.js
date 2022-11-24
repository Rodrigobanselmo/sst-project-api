"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsAvailable = void 0;
const common_1 = require("@nestjs/common");
const checkIsAvailable = (data, user, dataType) => {
    if (!data.id)
        throw new common_1.NotFoundException(`${dataType} not found`);
    if (data.system)
        return true;
    if (!user.targetCompanyId)
        throw new common_1.BadRequestException('Company ID is missing');
    if (data.companyId !== user.targetCompanyId)
        throw new common_1.ForbiddenException(`You are not allowed to access this ${dataType.toLowerCase()}`);
    return true;
};
exports.checkIsAvailable = checkIsAvailable;
//# sourceMappingURL=checkIsAvailable.js.map