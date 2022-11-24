"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emergencyIterable = void 0;
const elements_types_1 = require("../../../builders/pgr/types/elements.types");
const emergency_converter_1 = require("./emergency.converter");
const removeDuplicate_1 = require("../../../../../../shared/utils/removeDuplicate");
const emergencyIterable = (riskData, convertToDocx) => {
    const emergencyVarArray = (0, emergency_converter_1.emergencyConverter)(riskData);
    const iterableSections = (0, removeDuplicate_1.removeDuplicate)(emergencyVarArray, {
        simpleCompare: true,
    })
        .map((risk) => {
        if (!risk)
            return;
        return convertToDocx([
            {
                type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                text: risk,
                size: 10,
            },
        ]);
    })
        .filter((i) => i)
        .reduce((acc, curr) => {
        return [...acc, ...curr];
    }, []);
    return iterableSections;
};
exports.emergencyIterable = emergencyIterable;
//# sourceMappingURL=emergency.iterable.js.map