"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfessionalsConnections = void 0;
const deleteProfessionalsConnections = async (prisma) => {
    await prisma.company.updateMany({
        data: { doctorResponsibleId: null, tecResponsibleId: null },
    });
    await prisma.companyGroup.updateMany({
        data: { doctorResponsibleId: null },
    });
    await prisma.employeeExamsHistory.updateMany({
        data: { doctorId: null },
    });
    await prisma.riskFactorGroupDataToProfessional.deleteMany({});
    await prisma.documentPCMSOToProfessional.deleteMany({});
};
exports.deleteProfessionalsConnections = deleteProfessionalsConnections;
//# sourceMappingURL=delete-professionals-connections.js.map