"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedEsocial24 = void 0;
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const seedEsocial24 = async (prisma) => {
    try {
        const data = fs_1.default.readFileSync('prisma/seed/json/esocial24.txt', 'utf8');
        let group = '';
        const json = data
            .toString()
            .split('\n')
            .map((v) => {
            const isCode = v.slice(0, 1) == '0';
            const num = v.slice(1, 2);
            if (!isCode) {
                group = v;
                return;
            }
            const splitValue = v.split('\t');
            const getType = () => {
                if (num == '1')
                    return client_1.RiskFactorsEnum.QUI;
                if (num == '2')
                    return client_1.RiskFactorsEnum.FIS;
                if (num == '3')
                    return client_1.RiskFactorsEnum.BIO;
                return client_1.RiskFactorsEnum.OUTROS;
            };
            return {
                id: splitValue[0],
                name: splitValue[1],
                group,
                type: getType(),
                isQuantity: num == '2',
            };
        });
        console.log(json);
        await Promise.all(json
            .filter((i) => i)
            .map(async (j) => {
            await prisma.esocialTable24.upsert({
                create: Object.assign({}, j),
                update: Object.assign({}, j),
                where: { id: j.id },
            });
        }));
    }
    catch (e) {
        console.log('Error:', e.stack);
    }
};
exports.seedEsocial24 = seedEsocial24;
//# sourceMappingURL=read_24.js.map