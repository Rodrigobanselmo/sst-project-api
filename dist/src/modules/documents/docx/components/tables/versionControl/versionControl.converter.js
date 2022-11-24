"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionControlConverter = void 0;
const DayJSProvider_1 = require("../../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const data_sort_1 = require("../../../../../../shared/utils/sorts/data.sort");
const versionControl_constant_1 = require("./versionControl.constant");
const versionControlConverter = (documentsVersions) => {
    const rows = [];
    documentsVersions
        .sort((a, b) => (0, data_sort_1.sortData)(a, b, 'created_at'))
        .map((version, index) => {
        const cells = [];
        cells[versionControl_constant_1.VersionControlColumnEnum.INDEX] = { text: String(index) };
        cells[versionControl_constant_1.VersionControlColumnEnum.DATE] = {
            text: (0, DayJSProvider_1.dayjs)(version.created_at).format('DD/MM/YYYY') || '',
        };
        cells[versionControl_constant_1.VersionControlColumnEnum.DESCRIPTION] = {
            text: version.description || '',
        };
        cells[versionControl_constant_1.VersionControlColumnEnum.REVISION_BY] = {
            text: version.revisionBy || '',
        };
        cells[versionControl_constant_1.VersionControlColumnEnum.APPROVE_BY] = {
            text: version.approvedBy || '',
        };
        cells[versionControl_constant_1.VersionControlColumnEnum.SIGNATURE] = { text: '' };
        rows.push(cells);
    });
    return rows;
};
exports.versionControlConverter = versionControlConverter;
//# sourceMappingURL=versionControl.converter.js.map