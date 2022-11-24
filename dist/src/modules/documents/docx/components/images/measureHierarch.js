"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureHierarchyImage = void 0;
const docx_1 = require("docx");
const fs_1 = __importDefault(require("fs"));
const measureHierarchyImage = () => {
    const images = new docx_1.Paragraph({
        children: [
            new docx_1.ImageRun({
                data: fs_1.default.readFileSync('images/hierarchy-risk-pgr.png'),
                transformation: {
                    width: 600,
                    height: 350,
                },
            }),
        ],
        spacing: { after: 100 },
    });
    return [images];
};
exports.measureHierarchyImage = measureHierarchyImage;
//# sourceMappingURL=measureHierarch.js.map