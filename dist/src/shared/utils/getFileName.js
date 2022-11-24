"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNormalizeFileName = exports.getDocxFileName = void 0;
const getDocxFileName = ({ name, typeName = '', companyName, version, date, }) => {
    const docName = name.replace(/\s+/g, '');
    const fileAprName = `${docName.length > 0 ? docName + '-' : ''}${typeName}-${companyName}-${date}-Rev${version}.docx`
        .normalize('NFD')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '');
    return fileAprName;
};
exports.getDocxFileName = getDocxFileName;
const getNormalizeFileName = ({ name }) => {
    const fileName = name
        .normalize('NFD')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '');
    return fileName;
};
exports.getNormalizeFileName = getNormalizeFileName;
//# sourceMappingURL=getFileName.js.map