"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const authorization_1 = require("../src/shared/constants/enum/authorization");
const bcrypt_1 = require("bcrypt");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const createUserAndCompany = async () => {
    const id = process.env.NODE_ENV === 'test'
        ? '1'
        : 'b8635456-334e-4d6e-ac43-cfe5663aee17';
    const workId = (0, uuid_1.v4)();
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
    const risks = await prisma.riskFactors.createMany({
        data: [
            {
                id: (0, uuid_1.v4)(),
                companyId: company.id,
                name: 'Todos',
                system: true,
                type: 'ACI',
                representAll: true,
                severity: 0,
            },
            {
                id: (0, uuid_1.v4)(),
                companyId: company.id,
                name: 'Todos',
                system: true,
                representAll: true,
                type: 'BIO',
                severity: 0,
            },
            {
                id: (0, uuid_1.v4)(),
                companyId: company.id,
                name: 'Todos',
                system: true,
                type: 'QUI',
                representAll: true,
                severity: 0,
            },
            {
                id: (0, uuid_1.v4)(),
                companyId: company.id,
                name: 'Todos',
                representAll: true,
                system: true,
                type: 'FIS',
                severity: 0,
            },
            {
                id: (0, uuid_1.v4)(),
                companyId: company.id,
                name: 'Todos',
                system: true,
                type: 'ERG',
                representAll: true,
                severity: 0,
            },
        ],
    });
    const passwordHash = await (0, bcrypt_1.hash)('aaaa0123', 10);
    await prisma.user.create({
        data: {
            email: 'admin@simple.com',
            password: passwordHash,
            companies: {
                create: [
                    {
                        companyId: company.id,
                        roles: [authorization_1.RoleEnum.MASTER],
                        permissions: [authorization_1.PermissionEnum.MASTER],
                    },
                ],
            },
        },
    });
};
async function main() {
    await createUserAndCompany();
}
main()
    .catch(() => {
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map