"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const delete_professionals_connections_1 = require("./run/delete-professionals-connections");
const create_professional_council_1 = require("./run/create-professional-council");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        console.log('start');
        await (0, delete_professionals_connections_1.deleteProfessionalsConnections)(prisma);
        await (0, create_professional_council_1.addProfCOuncilNUll)(prisma);
        console.log('end');
    }
    catch (err) {
        console.error(err);
    }
}
main()
    .catch(() => {
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=run.js.map