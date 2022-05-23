"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = require("@nestjs/common");
const getCompanId_1 = require("../utils/getCompanId");
const isMater_1 = require("../utils/isMater");
exports.User = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const companyId = (0, getCompanId_1.getCompanyId)(request);
    const authInformation = (0, isMater_1.isMaster)(request.user, companyId);
    return Object.assign(Object.assign({}, request.user), authInformation);
});
//# sourceMappingURL=user.decorator.js.map