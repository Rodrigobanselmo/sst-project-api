"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const company_1 = require("./seed/company");
const employees_1 = require("./seed/employees");
const epis_1 = require("./seed/epis");
const risks_1 = require("./seed/risks");
const user_1 = require("./seed/user");
const prisma = new client_1.PrismaClient();
const createUserAndCompany = async () => {
    const { companyId, workId } = await (0, company_1.seedCompany)(prisma);
    await (0, employees_1.seedEmployees)(prisma, companyId, workId);
    await (0, risks_1.seedRisks)(prisma, companyId);
    await (0, user_1.seedUsers)(prisma, companyId);
    await (0, epis_1.seedEpis)(prisma);
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