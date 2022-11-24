"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulletTextConverter = void 0;
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const BulletTextConverter = (data) => {
    return data
        .map((doc) => ({
        [variables_enum_1.VariablesPGREnum.BULLET_TEXT]: doc || '',
    }))
        .sort((a, b) => a[variables_enum_1.VariablesPGREnum.BULLET_TEXT].localeCompare(b[variables_enum_1.VariablesPGREnum.BULLET_TEXT]));
};
exports.BulletTextConverter = BulletTextConverter;
//# sourceMappingURL=bullets.converter.js.map