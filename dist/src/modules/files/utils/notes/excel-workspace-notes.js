"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excelWorkspaceNotes = void 0;
const excelWorkspaceNotes = async (prisma, companyId) => {
    const workspaces = await prisma.workspace.findMany({
        where: { companyId },
    });
    return workspaces.map((workspace) => {
        return `${workspace.abbreviation}`;
    });
};
exports.excelWorkspaceNotes = excelWorkspaceNotes;
//# sourceMappingURL=excel-workspace-notes.js.map