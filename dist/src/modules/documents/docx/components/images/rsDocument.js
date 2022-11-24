"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsDocumentImage = void 0;
const docx_1 = require("docx");
const fs_1 = __importDefault(require("fs"));
const rsDocumentImage = () => {
    const images = new docx_1.Paragraph({
        children: [
            new docx_1.ImageRun({
                data: fs_1.default.readFileSync('images/rs-document.png'),
                transformation: {
                    width: 700,
                    height: 350,
                },
            }),
        ],
        spacing: { after: 100 },
    });
    return [images];
};
exports.rsDocumentImage = rsDocumentImage;
//# sourceMappingURL=rsDocument.js.map