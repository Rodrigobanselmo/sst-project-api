"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mime_types_1 = __importDefault(require("mime-types"));
class MimeClass {
    getExtension(contentType) {
        return mime_types_1.default.extension(contentType);
    }
    toContentType(extension) {
        return mime_types_1.default.contentType(extension);
    }
}
exports.default = MimeClass;
//# sourceMappingURL=mime.js.map