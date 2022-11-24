"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.representAll = void 0;
const representAll = async (prisma) => {
    await prisma.riskFactors.create({
        data: {
            name: 'Todos',
            system: true,
            companyId: 'b8635456-334e-4d6e-ac43-cfe5663aee17',
            severity: 0,
            representAll: true,
            type: 'OUTROS',
        },
    });
};
exports.representAll = representAll;
//# sourceMappingURL=represent-all.js.map