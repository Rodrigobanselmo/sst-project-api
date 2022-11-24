"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyId = void 0;
const getBodyCompanyId = (company) => {
    var _a, _b;
    if (!company)
        return;
    if (!Array.isArray(company) && typeof company === 'object') {
        return (_a = company === null || company === void 0 ? void 0 : company.companyId) !== null && _a !== void 0 ? _a : undefined;
    }
    if (Array.isArray(company)) {
        const companyId = company[0] && ((_b = company[0]) === null || _b === void 0 ? void 0 : _b.companyId);
        if (!companyId)
            return;
        const allSameCompany = company.every((item) => {
            return (item === null || item === void 0 ? void 0 : item.companyId) && item.companyId === companyId;
        });
        return allSameCompany ? companyId : false;
    }
};
const getCompanyId = (req) => {
    const query = req.query;
    const params = req.params;
    const body = req.body;
    if (params && params.companyId)
        return params.companyId;
    if (query && query.companyId)
        return query.companyId;
    if (body) {
        const bodySearch = getBodyCompanyId(body);
        if (bodySearch === false)
            return false;
        if (bodySearch)
            return bodySearch;
    }
    return;
};
exports.getCompanyId = getCompanyId;
//# sourceMappingURL=getCompanId.js.map