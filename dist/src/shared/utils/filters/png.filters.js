"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pngFileFilter = void 0;
const common_1 = require("@nestjs/common");
const path = __importStar(require("path"));
const pngFileFilter = (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png') {
        req.fileValidationError = 'Invalid file type';
        return callback(new common_1.BadGatewayException('Invalid file type'), false);
    }
    return callback(null, true);
};
exports.pngFileFilter = pngFileFilter;
//# sourceMappingURL=png.filters.js.map