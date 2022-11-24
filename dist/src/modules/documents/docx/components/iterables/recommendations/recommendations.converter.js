"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationsConverter = void 0;
const client_1 = require("@prisma/client");
const recommendationsConverter = (riskData) => {
    const remove = ['Não aplicável', 'Não verificada', 'Não implementada'];
    const eng = {
        data: [],
        title: 'Medidas de Controle de Engenharia',
    };
    const adm = {
        data: [],
        title: 'Procedimentos de Trabalho e Controles Administrativos',
    };
    const epi = {
        data: [],
        title: 'Equipamentos de Proteção Individual (Quando aplicável)',
    };
    const others = { data: [], title: 'Outras Recomendações' };
    riskData.forEach((data) => {
        ((data === null || data === void 0 ? void 0 : data.recs) || []).forEach((rec) => {
            if (remove.includes(rec.recName))
                return;
            if (rec.recType === client_1.RecTypeEnum.ENG) {
                if (!eng.data.find((r) => r == rec.recName))
                    eng.data.push(rec.recName);
            }
            if (rec.recType === client_1.RecTypeEnum.ADM) {
                if (!adm.data.find((r) => r == rec.recName))
                    adm.data.push(rec.recName);
            }
            if (rec.recType === client_1.RecTypeEnum.EPI) {
                if (!epi.data.find((r) => r == rec.recName))
                    epi.data.push(rec.recName);
            }
            if (!rec.recType) {
                if (!others.data.find((r) => r == rec.recName))
                    others.data.push(rec.recName);
            }
        });
    });
    return [eng, adm, epi, others];
};
exports.recommendationsConverter = recommendationsConverter;
//# sourceMappingURL=recommendations.converter.js.map