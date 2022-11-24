"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionControlTableSection = void 0;
const docx_1 = require("docx");
const versionControl_table_1 = require("./versionControl.table");
const versionControlTableSection = (riskDocumentEntity) => {
    const table = (0, versionControl_table_1.versionControlTable)(riskDocumentEntity);
    const section = {
        children: [table],
        properties: {
            page: {
                margin: { left: 500, right: 500, top: 500, bottom: 500 },
                size: { orientation: docx_1.PageOrientation.LANDSCAPE },
            },
        },
    };
    return section;
};
exports.versionControlTableSection = versionControlTableSection;
//# sourceMappingURL=versionControl.section.js.map