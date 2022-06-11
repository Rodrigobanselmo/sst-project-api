"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCompany = void 0;
const uuid_1 = require("uuid");
const seedCompany = async (prisma, options) => {
    const id = process.env.NODE_ENV === 'test'
        ? '1'
        : 'b8635456-334e-4d6e-ac43-cfe5663aee17';
    const workId = (0, uuid_1.v4)();
    if (options.skip) {
        return { workId, companyId: id, company: {} };
    }
    const company = await prisma.company.create({
        data: {
            id,
            cnpj: '07.689.002/0001-89',
            fantasy: 'Simple',
            name: 'Simplesst LTDA',
            status: 'ACTIVE',
            type: 'MASTER',
            license: { create: { companyId: id } },
            workspace: {
                create: {
                    name: 'MATRIZ',
                    abbreviation: 'MA',
                    id: workId,
                    address: { create: { cep: '12246-000' } },
                },
            },
        },
        include: { workspace: true },
    });
    return { workId, companyId: id, company };
};
exports.seedCompany = seedCompany;
//# sourceMappingURL=company.js.map