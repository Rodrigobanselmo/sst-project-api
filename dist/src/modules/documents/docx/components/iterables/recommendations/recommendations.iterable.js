"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationsIterable = void 0;
const elements_types_1 = require("../../../builders/pgr/types/elements.types");
const recommendations_converter_1 = require("./recommendations.converter");
const recommendationsIterable = (riskData, convertToDocx) => {
    const recommendationsVarArray = (0, recommendations_converter_1.recommendationsConverter)(riskData);
    const iterableSections = recommendationsVarArray
        .map(({ data, title }) => {
        if (data.length == 0)
            return;
        return convertToDocx([
            {
                type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                text: title,
            },
            ...data.map((rec) => ({
                type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                text: rec,
                size: 8,
            })),
        ]);
    })
        .filter((i) => i)
        .reduce((acc, curr) => {
        return [...acc, ...curr];
    }, []);
    return iterableSections;
};
exports.recommendationsIterable = recommendationsIterable;
//# sourceMappingURL=recommendations.iterable.js.map