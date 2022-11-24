"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryArray = void 0;
const QueryArray = (data, transformValue) => {
    const str = data.obj[data.key];
    if (typeof str === 'string') {
        if (transformValue)
            return [transformValue(str)];
        return [str];
    }
    return str;
};
exports.QueryArray = QueryArray;
//# sourceMappingURL=query-array.js.map