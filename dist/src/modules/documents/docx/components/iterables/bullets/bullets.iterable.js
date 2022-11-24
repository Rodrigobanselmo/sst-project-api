"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulletTextIterable = void 0;
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const elements_types_1 = require("../../../builders/pgr/types/elements.types");
const bullets_converter_1 = require("./bullets.converter");
const bulletTextIterable = (bulletText, convertToDocx) => {
    const bulletTextVarArray = (0, bullets_converter_1.BulletTextConverter)(bulletText);
    const iterableSections = bulletTextVarArray
        .map((variables) => {
        return convertToDocx([
            {
                type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                text: `??${variables_enum_1.VariablesPGREnum.BULLET_TEXT}??`,
                level: 0,
            },
        ], variables);
    })
        .reduce((acc, curr) => {
        return [...acc, ...curr];
    }, []);
    return iterableSections;
};
exports.bulletTextIterable = bulletTextIterable;
//# sourceMappingURL=bullets.iterable.js.map