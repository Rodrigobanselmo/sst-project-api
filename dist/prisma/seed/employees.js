"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedEmployees = void 0;
const seedEmployees = async (prisma, companyId, workId) => {
    await prisma.hierarchy.createMany({
        data: [
            {
                name: 'Presidência',
                type: 'DIRECTORY',
                id: 'a',
                companyId: companyId,
            },
            {
                name: 'Gerente',
                type: 'MANAGEMENT',
                id: 'b',
                parentId: 'a',
                companyId: companyId,
            },
            {
                name: 'Tecnologia',
                type: 'SECTOR',
                id: 'c',
                parentId: 'b',
                companyId: companyId,
            },
            {
                name: 'Médicina ocupacional',
                type: 'SECTOR',
                id: 'f',
                parentId: 'b',
                companyId: companyId,
            },
            {
                name: 'Engenheiro de Segurança',
                type: 'OFFICE',
                id: 'd',
                parentId: 'f',
                companyId: companyId,
            },
            {
                name: 'Engenheiro de Software',
                type: 'OFFICE',
                id: 'e',
                parentId: 'c',
                companyId: companyId,
            },
        ],
    });
    try {
        await prisma.company.update({
            where: { id: companyId },
            include: { employees: true },
            data: {
                employees: {
                    create: [
                        {
                            cpf: '1234567894',
                            name: 'Alex Abreu Marins',
                            workspaces: {
                                connect: {
                                    id_companyId: { companyId: companyId, id: workId },
                                },
                            },
                            hierarchy: {
                                connect: { id: 'f' },
                            },
                        },
                        {
                            cpf: '1234567892',
                            name: 'Rodrigo Barbosa Anselmo',
                            workspaces: {
                                connect: {
                                    id_companyId: { companyId: companyId, id: workId },
                                },
                            },
                            hierarchy: {
                                connect: { id: 'e' },
                            },
                        },
                    ],
                },
            },
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.seedEmployees = seedEmployees;
//# sourceMappingURL=employees.js.map