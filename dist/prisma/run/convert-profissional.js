"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertProf = void 0;
const convertProf = async (prisma) => {
    const users = await prisma.user.findMany();
    Promise.all(users.map(async (user) => {
        const { cpf, phone, name, id, email, } = user;
        await prisma.user.update({
            where: { id: id },
            data: {
                professional: {
                    upsert: {
                        update: {
                            cpf,
                            phone,
                            name,
                        },
                        create: {
                            cpf,
                            phone,
                            name,
                            email,
                        },
                    },
                },
            },
        });
    }));
};
exports.convertProf = convertProf;
//# sourceMappingURL=convert-profissional.js.map