"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDuplicate = void 0;
function removeDuplicate(array, options) {
    if (options === null || options === void 0 ? void 0 : options.simpleCompare)
        return array.filter((item, index, self) => index === self.findIndex((t) => t == item));
    if (options === null || options === void 0 ? void 0 : options.removeById)
        return array.filter((item, index, self) => index ===
            self.findIndex((t) => t[options.removeById] ==
                item[options.removeById]));
    return array;
}
exports.removeDuplicate = removeDuplicate;
//# sourceMappingURL=removeDuplicate.js.map