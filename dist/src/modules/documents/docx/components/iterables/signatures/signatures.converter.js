"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignaturesConverter = void 0;
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const professionals_converter_1 = require("../professionals/professionals.converter");
const SignaturesConverter = (signatureEntity, workspace) => {
    return signatureEntity
        .filter((professional) => 'professionalPgrSignature' in professional
        ? professional.professionalPgrSignature.isSigner
        : 'professionalPgrSignature' in professional
            ? professional.professionalPgrSignature.isSigner
            : false)
        .map((signature) => {
        const crea = (0, professionals_converter_1.getCredential)(signature);
        return {
            [variables_enum_1.VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]: signature.certifications.join(' -- ') || '',
            [variables_enum_1.VariablesPGREnum.PROFESSIONAL_CREA]: crea || '',
            [variables_enum_1.VariablesPGREnum.PROFESSIONAL_FORMATION]: signature.formation.join('/') || '',
            [variables_enum_1.VariablesPGREnum.PROFESSIONAL_NAME]: signature.name || '',
            [variables_enum_1.VariablesPGREnum.PROFESSIONAL_CPF]: signature.cpf || '',
        };
    });
};
exports.SignaturesConverter = SignaturesConverter;
//# sourceMappingURL=signatures.converter.js.map