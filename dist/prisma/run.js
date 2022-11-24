"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const read_24_1 = require("./seed/read_24");
const change_rec_med_1 = require("./run/change-rec-med");
const create_no_risk_1 = require("./run/create-no-risk");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        console.log('start');
        await (0, read_24_1.seedEsocial24)(prisma);
        await (0, change_rec_med_1.changeRecMed)(prisma);
        await (0, create_no_risk_1.CreateAbsenceRisk)(prisma);
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