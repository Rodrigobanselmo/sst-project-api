"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectValueFromString = exports.transformStringToObject = void 0;
const transformStringToObject = (string, value, index = 0) => {
    const arraySplitted = string.split('.');
    if (arraySplitted.length === index + 1)
        return { [arraySplitted[index]]: value };
    return {
        [arraySplitted[index]]: (0, exports.transformStringToObject)(string, value, index + 1),
    };
};
exports.transformStringToObject = transformStringToObject;
const getObjectValueFromString = (string, value, index = 0) => {
    const arraySplitted = string.split('.');
    if (arraySplitted.length === index + 1)
        return value[arraySplitted[index]];
    return (0, exports.getObjectValueFromString)(string, value[arraySplitted[index]], index + 1);
};
exports.getObjectValueFromString = getObjectValueFromString;
//# sourceMappingURL=transformStringToObject.js.map