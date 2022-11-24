"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalsConverter = exports.getCredential = void 0;
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const getCredential = (row) => {
    if (row && 'councilId' in row) {
        return `${(row === null || row === void 0 ? void 0 : row.councilType) ? row.councilType + ': ' : ''}${row.councilId}${(row === null || row === void 0 ? void 0 : row.councilUF) ? ' - ' + row.councilUF : ''}`;
    }
    return '';
};
exports.getCredential = getCredential;
const ProfessionalsConverter = (professionalEntity, workspace) => {
    return professionalEntity
        .filter((professional) => 'professionalPgrSignature' in professional
        ? professional.professionalPgrSignature.isElaborator
        : 'professionalPgrSignature' in professional
            ? professional.professionalPgrSignature.isElaborator
            : false)
        .map((professional) => {
        const crea = (0, exports.getCredential)(professional);
        return {
            [variables_enum_1.VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]: professional.certifications.join(' -- ') || '',
            [variables_enum_1.VariablesPGREnum.PROFESSIONAL_CREA]: crea || '',
            [variables_enum_1.VariablesPGREnum.PROFESSIONAL_FORMATION]: professional.formation.join('/') || '',
            [variables_enum_1.VariablesPGREnum.PROFESSIONAL_NAME]: professional.name || '',
            [variables_enum_1.VariablesPGREnum.PROFESSIONAL_CPF]: professional.cpf || '',
        };
    });
};
exports.ProfessionalsConverter = ProfessionalsConverter;
//# sourceMappingURL=professionals.converter.js.map