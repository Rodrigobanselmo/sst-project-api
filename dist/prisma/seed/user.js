"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = void 0;
const bcrypt_1 = require("bcrypt");
const authorization_1 = require("../../src/shared/constants/enum/authorization");
const seedUsers = async (prisma, companyId) => {
    const passwordHash = await (0, bcrypt_1.hash)('aaaa0123', 10);
    await prisma.user.create({
        data: {
            email: 'admin@simple.com',
            password: passwordHash,
            companies: {
                create: [
                    {
                        companyId: companyId,
                        roles: [authorization_1.RoleEnum.MASTER],
                        permissions: [authorization_1.PermissionEnum.MASTER],
                    },
                ],
            },
        },
    });
};
exports.seedUsers = seedUsers;
//# sourceMappingURL=user.js.map