"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllCompanies = void 0;
const findAllCompanies = async (excelProvider, companyRepository, riskSheet, companyId, isMaster) => {
    let data = [];
    if (!isMaster)
        data = await companyRepository.findAllRelatedByCompanyId(companyId, {
            include: { primary_activity: true, secondary_activity: true },
        });
    if (isMaster)
        data = await companyRepository.findAll({
            include: { primary_activity: true, secondary_activity: true },
        });
    const excelRows = await excelProvider.transformToExcelData(data, riskSheet.columns);
    return {
        sheetName: riskSheet.name,
        rows: excelRows,
        tableHeader: riskSheet.columns,
    };
};
exports.findAllCompanies = findAllCompanies;
//# sourceMappingURL=findAllCompanies.js.map