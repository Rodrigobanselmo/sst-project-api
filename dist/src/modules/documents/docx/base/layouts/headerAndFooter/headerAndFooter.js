"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headerAndFooter = void 0;
const styles_1 = require("../../config/styles");
const footer_1 = require("./footer");
const header_1 = require("./header");
const headerAndFooter = ({ version, footerText, logoPath, }) => {
    return {
        footers: (0, footer_1.createFooter)({
            footerText,
            version,
        }),
        headers: (0, header_1.createHeader)({
            path: logoPath,
        }),
        properties: styles_1.sectionProperties,
    };
};
exports.headerAndFooter = headerAndFooter;
//# sourceMappingURL=headerAndFooter.js.map