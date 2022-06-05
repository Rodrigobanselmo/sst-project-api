"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashProvider = void 0;
const bcrypt_1 = require("bcrypt");
class HashProvider {
    async createHash(password) {
        const passwordHash = await (0, bcrypt_1.hash)(password, 10);
        return passwordHash;
    }
    async compare(password, hash_password) {
        return (0, bcrypt_1.compare)(password, hash_password);
    }
}
exports.HashProvider = HashProvider;
//# sourceMappingURL=HashProvider.js.map