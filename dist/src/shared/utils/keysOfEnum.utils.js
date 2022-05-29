"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeysOfEnum = void 0;
const KeysOfEnum = (enums) => {
    return Object.keys(enums)
        .filter((x) => !(parseInt(x) >= 0))
        .join(', ');
};
exports.KeysOfEnum = KeysOfEnum;
//# sourceMappingURL=keysOfEnum.utils.js.map