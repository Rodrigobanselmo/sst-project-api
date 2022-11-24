"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskDataRecsAll = void 0;
const riskDataRecsAll = async (prisma) => {
    const companyIds = [
        'd1309cad-19d4-4102-9bf9-231f91095c20',
        'c615edfb-c68b-4842-863e-17a1b6797932',
        '2b916bb4-1476-41cc-8826-e8bd29f7ba13',
        '0c5c5e82-2c19-46ad-a8de-7615ed039bc4',
        '11bc8263-d1e7-4bfa-bfee-7db30c768a22',
        '79ae200f-85d5-415f-bff3-c8d5b711731f',
        '49e86923-95a9-4d58-9cb4-c55ae12928ed',
        '4be08622-86de-4cd9-b31e-4f9bd92e1203',
    ];
    const riskFactorData = await prisma.riskFactorData.findMany({
        where: {
            companyId: { in: companyIds },
            adms: {
                some: { medName: { in: ['Não identificada', 'Não informada'] } },
            },
        },
        include: {
            adms: {
                select: { id: true },
                where: { medName: { in: ['Não identificada', 'Não informada'] } },
            },
        },
    });
    await Promise.all(riskFactorData.map(async (riskData) => {
        await prisma.riskFactorData.update({
            where: { id: riskData.id },
            data: {
                adms: { disconnect: riskData.adms.map((d) => ({ id: d.id })) },
            },
        });
    }));
};
exports.riskDataRecsAll = riskDataRecsAll;
//# sourceMappingURL=riskData-recs-all.js.map