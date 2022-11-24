"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentsConverter = void 0;
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const attachmentsConverter = (attachments) => {
    const attachmentsData = [];
    attachments.forEach((attachment) => {
        if (attachment === null || attachment === void 0 ? void 0 : attachment.url)
            attachmentsData.push({
                [variables_enum_1.VariablesPGREnum.ATTACHMENT_LINK]: attachment.url,
                [variables_enum_1.VariablesPGREnum.ATTACHMENT_NAME]: attachment.name,
            });
    });
    return attachmentsData;
};
exports.attachmentsConverter = attachmentsConverter;
//# sourceMappingURL=attachments.converter.js.map