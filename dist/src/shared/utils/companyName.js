"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyName = void 0;
const getCompanyName = (company) => {
    if (!company)
        return '';
    const initials = (company === null || company === void 0 ? void 0 : company.initials) ? `(${company === null || company === void 0 ? void 0 : company.initials})` : '';
    const name = (company === null || company === void 0 ? void 0 : company.fantasy) || (company === null || company === void 0 ? void 0 : company.name) || '';
    const companyName = (initials ? initials + ' ' : '') + name;
    return companyName;
};
exports.getCompanyName = getCompanyName;
//# sourceMappingURL=companyName.js.map