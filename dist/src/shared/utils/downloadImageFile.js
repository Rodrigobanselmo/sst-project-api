"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadImageFile = exports.getExtensionFromUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const getExtensionFromUrl = (url) => {
    if (!url)
        return '';
    const urlFile = url.split('/');
    return urlFile[urlFile.length - 1].split('.')[1];
};
exports.getExtensionFromUrl = getExtensionFromUrl;
const downloadImageFile = async (url, image_path) => {
    if (!url)
        return null;
    return (0, axios_1.default)({
        url,
        responseType: 'stream',
    })
        .then((response) => new Promise((resolve, reject) => {
        response.data
            .pipe(fs_1.default.createWriteStream(image_path))
            .on('finish', () => resolve(image_path))
            .on('error', (e) => reject(e));
    }))
        .catch((e) => {
        console.log('downloadImageFile', e);
        return null;
    });
};
exports.downloadImageFile = downloadImageFile;
//# sourceMappingURL=downloadImageFile.js.map