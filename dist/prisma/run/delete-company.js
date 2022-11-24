"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = exports.deleteWithNameCompany = void 0;
const deleteWithNameCompany = async (name, prisma) => {
    const company = await prisma.company.findMany({
        where: { name },
    });
    try {
        await Promise.all(company.map(async ({ id }) => {
            return (0, exports.deleteCompany)(id, prisma);
        }));
    }
    catch (error) {
        console.log(error);
        console.log('error: end');
    }
    console.log('end');
};
exports.deleteWithNameCompany = deleteWithNameCompany;
const deleteCompany = async (id, prisma) => {
    await prisma.companyEnvironmentPhoto.deleteMany({
        where: {
            companyEnvironment: {
                OR: [{ companyId: id }, { homogeneousGroup: { companyId: id } }],
            },
        },
    });
    await prisma.companyCharacterizationPhoto.deleteMany({
        where: {
            companyEnvironment: {
                OR: [{ companyId: id }, { homogeneousGroup: { companyId: id } }],
            },
        },
    });
    await prisma.companyCharacterization.deleteMany({
        where: { OR: [{ companyId: id }, { homogeneousGroup: { companyId: id } }] },
    });
    await prisma.companyEnvironment.deleteMany({
        where: { OR: [{ companyId: id }, { homogeneousGroup: { companyId: id } }] },
    });
    console.count();
    await prisma.homogeneousGroup.deleteMany({ where: { companyId: id } });
    console.count();
    await prisma.hierarchy.deleteMany({ where: { companyId: id } });
    console.count();
    await prisma.workspace.deleteMany({
        where: { companyId: id },
    });
    console.count();
    await prisma.contact.deleteMany({
        where: { companyId: id },
    });
    console.count();
    await prisma.contract.deleteMany({
        where: { receivingServiceCompanyId: id },
    });
    console.count();
    await prisma.contract.deleteMany({
        where: { applyingServiceCompanyId: id },
    });
    console.count();
    await prisma.generateSource.deleteMany({
        where: { companyId: id },
    });
    console.count();
    await prisma.inviteUsers.deleteMany({
        where: { companyId: id },
    });
    console.count();
    await prisma.company.delete({ where: { id } });
};
exports.deleteCompany = deleteCompany;
//# sourceMappingURL=delete-company.js.map