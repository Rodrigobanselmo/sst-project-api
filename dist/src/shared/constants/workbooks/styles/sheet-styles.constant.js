"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sheetStylesConstant = void 0;
const colors = {
    optional: '4fb364',
    required: 'd9d239',
    addMore: '2333ff',
};
exports.sheetStylesConstant = {
    fill: {
        optional: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colors.optional },
        },
        required: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colors.required },
        },
    },
    border: {
        addMore: {
            bottom: { style: 'medium', color: { argb: '2333ff' } },
        },
    },
};
//# sourceMappingURL=sheet-styles.constant.js.map