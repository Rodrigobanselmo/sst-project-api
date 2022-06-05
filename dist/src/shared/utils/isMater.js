"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMaster = void 0;
const authorization_1 = require("../constants/enum/authorization");
const isMaster = (user, companyId) => {
    const includeMaster = user && user.roles && user.roles.includes(authorization_1.RoleEnum.MASTER);
    const sameCompany = companyId ? user.companyId === companyId : true;
    return {
        isMaster: includeMaster && sameCompany,
        companyId: user.companyId,
        targetCompanyId: companyId || user.companyId,
    };
};
exports.isMaster = isMaster;
//# sourceMappingURL=isMater.js.map