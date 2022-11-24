"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProfCOuncilNUll = void 0;
const addProfCOuncilNUll = async (prisma) => {
    const prof = await prisma.professional.findMany({
        where: { councils: { none: { id: { gt: 0 } } } },
        select: { councils: true, id: true },
    });
    await Promise.all(prof.map(async (prof) => {
        await prisma.professional.update({
            where: { id: prof.id },
            data: {
                councils: {
                    create: { councilId: '', councilType: '', councilUF: '' },
                },
            },
        });
    }));
};
exports.addProfCOuncilNUll = addProfCOuncilNUll;
//# sourceMappingURL=create-professional-council.js.map