"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllCompanies = void 0;
const findAllCompanies = async (excelProvider, companyRepository, riskSheet, companyId, isMaster) => {
    let data = [];
    if (!isMaster) {
        const response = await companyRepository.findAllRelatedByCompanyId(companyId, {}, { take: 100000 }, {
            include: {
                primary_activity: true,
                secondary_activity: true,
                workspace: { include: { address: true } },
                group: true,
                doctorResponsible: { include: { professional: true } },
                tecResponsible: { include: { professional: true } },
                address: true,
                contacts: { where: { isPrincipal: true } },
            },
        });
        data = response.data;
    }
    if (isMaster) {
        const response = await companyRepository.findAll({}, { take: 100000 }, {
            include: { primary_activity: true, secondary_activity: true },
        });
        data = response.data;
    }
    const excelRows = await excelProvider.transformToExcelData(data, riskSheet.columns);
    return {
        sheetName: riskSheet.name,
        rows: excelRows,
        tableHeader: riskSheet.columns,
    };
};
exports.findAllCompanies = findAllCompanies;
//# sourceMappingURL=findAllCompanies.js.map