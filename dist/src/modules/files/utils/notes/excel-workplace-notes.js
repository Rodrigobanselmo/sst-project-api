"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excelWorkplaceNotes = void 0;
const excelWorkplaceNotes = async (prisma, companyId) => {
    const workplaces = await prisma.workspace.findMany({
        where: { companyId },
    });
    return workplaces.map((workplace) => {
        return `${workplace.abbreviation}`;
    });
};
exports.excelWorkplaceNotes = excelWorkplaceNotes;
//# sourceMappingURL=excel-workplace-notes.js.map