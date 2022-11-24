"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedEpis = void 0;
const seedEpis = async (prisma) => {
    const equipments = ['Não aplicável', 'Não verificada', 'Não implementada'];
    equipments.map(async (equipment, index) => await prisma.epi.create({
        data: {
            ca: String(index),
            equipment,
            description: 'NA',
        },
    }));
};
exports.seedEpis = seedEpis;
//# sourceMappingURL=epis.js.map