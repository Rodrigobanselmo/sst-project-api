"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRecMed = void 0;
const changeRecMed = async (prisma) => {
    await prisma.recMed.updateMany({
        data: {
            medName: 'Não implementada',
        },
        where: { medName: 'Não identificada' },
    });
    await prisma.recMed.updateMany({
        data: {
            medName: 'Não verificada',
        },
        where: { medName: 'Não informada' },
    });
};
exports.changeRecMed = changeRecMed;
//# sourceMappingURL=change-rec-med.js.map