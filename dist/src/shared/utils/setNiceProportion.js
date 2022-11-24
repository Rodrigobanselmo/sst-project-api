"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNiceProportion = void 0;
const setNiceProportion = (maxWidth, maxHeight, imgWidth, imgHeight) => {
    let width = maxWidth;
    let height = maxHeight;
    const proportionHeight = imgHeight / maxHeight;
    const proportionWidth = imgWidth / maxWidth;
    const isHeightProportionHigher = proportionHeight > proportionWidth;
    if (isHeightProportionHigher) {
        width = imgWidth / proportionHeight;
        height = maxHeight;
    }
    else {
        width = maxWidth;
        height = imgHeight / proportionWidth;
    }
    return { width, height };
};
exports.setNiceProportion = setNiceProportion;
//# sourceMappingURL=setNiceProportion.js.map