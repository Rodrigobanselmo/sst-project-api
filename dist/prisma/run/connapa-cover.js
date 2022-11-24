"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connapaCover = void 0;
const connapaId = '6527c27e-949a-4888-a784-ac4e4b19ed0c';
const jsonCover = {
    coverProps: {
        logoProps: { maxLogoHeight: 141, y: 78, maxLogoWidth: 212, x: 210 },
        backgroundImagePath: 'images/cover/connapa.jpeg',
        titleProps: {
            x: 163,
            y: 310,
            boxX: 464,
            boxY: 0,
            size: 28,
            color: 'FFFFFF',
        },
        versionProps: {
            x: 163,
            y: 480,
            boxX: 464,
            boxY: 0,
            color: 'FFFFFF',
            size: 14,
        },
        companyProps: {
            x: 163,
            y: 510,
            boxX: 464,
            boxY: 0,
            color: 'FFFFFF',
            size: 14,
        },
    },
};
const connapaCover = async (prisma) => {
    const connapa = await prisma.documentCover.findFirst({
        where: { companyId: connapaId },
    });
    await prisma.documentCover.update({
        data: {
            json: jsonCover,
            companyId: connapaId,
        },
        where: { id: connapa.id },
    });
};
exports.connapaCover = connapaCover;
//# sourceMappingURL=connapa-cover.js.map