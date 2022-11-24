"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.levelRiskData = void 0;
const riskData_entity_1 = require("../../src/modules/sst/entities/riskData.entity");
const matriz_1 = require("../../src/shared/utils/matriz");
const levelRiskData = async (prisma) => {
    const riskDataPrisma = await prisma.riskFactorData.findMany({
        where: { level: null },
        include: {
            riskFactor: true,
        },
    });
    try {
        const riskData = riskDataPrisma.map((rd) => new riskData_entity_1.RiskFactorDataEntity(rd));
        await Promise.all(riskData.map(async (rd) => {
            var _a;
            if (!((_a = rd === null || rd === void 0 ? void 0 : rd.riskFactor) === null || _a === void 0 ? void 0 : _a.severity))
                return null;
            if (!(rd === null || rd === void 0 ? void 0 : rd.probability))
                return null;
            const matrix = (0, matriz_1.getMatrizRisk)(rd.riskFactor.severity, rd.probability);
            await prisma.riskFactorData.update({
                data: { level: matrix.level },
                where: { id: rd.id },
            });
        }));
    }
    catch (err) {
        console.log(err);
    }
};
exports.levelRiskData = levelRiskData;
//# sourceMappingURL=level-risk-data.js.map