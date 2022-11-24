"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAbsenceRisk = void 0;
const CreateAbsenceRisk = async (prisma) => {
    await prisma.riskFactors.create({
        data: {
            name: 'Ausência de Risco',
            system: true,
            companyId: 'b8635456-334e-4d6e-ac43-cfe5663aee17',
            severity: 0,
            representAll: false,
            type: 'OUTROS',
            isPPP: true,
            isAso: true,
            isPCMSO: true,
            isPGR: true,
            esocialCode: '09.01.001',
        },
    });
};
exports.CreateAbsenceRisk = CreateAbsenceRisk;
//# sourceMappingURL=create-no-risk.js.map