"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.docPGRSections = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const _1_0_init_1 = require("./1.0-init");
const _1_1_definitions_1 = require("./1.1-definitions");
const _1_2_definitions_1 = require("./1.2-definitions");
const _1_3_complements_1 = require("./1.3-complements");
const _1_4_mvv_1 = require("./1.4-mvv");
const _1_5_organization_1 = require("./1.5-organization");
const _1_5_organization2_1 = require("./1.5-organization2");
const _1_6_development_1 = require("./1.6-development");
const _1_7_qualityEvaluation_1 = require("./1.7-qualityEvaluation");
const _1_8_prioritization_1 = require("./1.8-prioritization");
const _1_9_investigation_1 = require("./1.9-investigation");
const _1_9_1_rs_1 = require("./1.9.1-rs");
const _1_9_2_document_1 = require("./1.9.2-document");
const _1_9_3_avaliation_1 = require("./1.9.3-avaliation");
const _2_0_envronment_1 = require("./2.0-envronment");
const _2_1_employee_1 = require("./2.1-employee");
const _2_1_1_characterization_1 = require("./2.1.1-characterization");
const _2_2_riskFactors_1 = require("./2.2-riskFactors");
const _2_3_riskFactors_1 = require("./2.3-riskFactors");
const _2_4_riskFactors_1 = require("./2.4-riskFactors");
const _2_5_gse_1 = require("./2.5-gse");
const _2_5_1_gse_1 = require("./2.5.1-gse");
const _2_6_quality_1 = require("./2.6-quality");
const _2_6_1_quantity_1 = require("./2.6.1-quantity");
const _2_6_2_quantity_noise_1 = require("./2.6.2-quantity-noise");
const _2_6_3_quantity_heat_1 = require("./2.6.3-quantity-heat");
const _2_6_4_quantity_vfb_1 = require("./2.6.4-quantity-vfb");
const _2_6_5_quantity_vl_1 = require("./2.6.5-quantity-vl");
const _2_6_6_quantity_rad_1 = require("./2.6.6-quantity-rad");
const _2_6_7_quantity_qui_1 = require("./2.6.7-quantity-qui");
const _2_7_prioritization_1 = require("./2.7-prioritization");
const _2_7_1_prioritization_1 = require("./2.7.1-prioritization");
const _2_8_recommendations_1 = require("./2.8-recommendations");
const _2_8_1_recommendations_1 = require("./2.8.1-recommendations");
const _2_9_end_1 = require("./2.9-end");
const _3_01_anexos_link_1 = require("./3.01-anexos-link");
exports.docPGRSections = {
    sections: [
        _1_0_init_1.initSection,
        _1_1_definitions_1.definitionsSection,
        _1_2_definitions_1.definitions2Section,
        _1_3_complements_1.complementsSection,
        _1_4_mvv_1.mvvSection,
        _1_5_organization_1.organizationSection,
        _1_5_organization2_1.organization2Section,
        _1_6_development_1.developmentSection,
        _1_7_qualityEvaluation_1.qualityEvaluation,
        _1_8_prioritization_1.prioritization,
        _1_9_investigation_1.investigation,
        _1_9_1_rs_1.rs,
        _1_9_2_document_1.document,
        _1_9_3_avaliation_1.available,
        _2_0_envronment_1.environmentSection,
        _2_1_employee_1.employeeSection,
        _2_1_1_characterization_1.characterizationSection,
        _2_2_riskFactors_1.riskFactorsSection,
        _2_3_riskFactors_1.riskFactors2Section,
        _2_4_riskFactors_1.riskFactors3Section,
        _2_5_gse_1.gseSection,
        _2_5_1_gse_1.gse2Section,
        _2_6_quality_1.qualitySection,
        _2_6_1_quantity_1.quantitySection,
        _2_6_2_quantity_noise_1.quantityNoiseSection,
        _2_6_3_quantity_heat_1.quantityHeatSection,
        _2_6_4_quantity_vfb_1.quantityVFBSection,
        _2_6_5_quantity_vl_1.quantityVLSection,
        _2_6_6_quantity_rad_1.quantityRadSection,
        _2_6_7_quantity_qui_1.quantityQuiSection,
        _2_7_prioritization_1.prioritizationSection,
        _2_7_1_prioritization_1.prioritization2Section,
        _2_8_recommendations_1.recommendationsSection,
        _2_8_1_recommendations_1.recommendations1Section,
        _2_9_end_1.endSection,
        _3_01_anexos_link_1.attachmentsLinkSection,
    ],
    variables: {
        [variables_enum_1.VariablesPGREnum.CHAPTER_1]: 'PARTE 01 – DOCUMENTO BASE',
        [variables_enum_1.VariablesPGREnum.CHAPTER_2]: 'PARTE 02 – ANÁLISE PRELIMINAR E INDENTIFICAÇÃO DE PERIGOS',
        [variables_enum_1.VariablesPGREnum.CHAPTER_3]: 'PARTE 03 – AVALIAÇÃO DOS RISCOS OCUPACIONAIS',
        [variables_enum_1.VariablesPGREnum.CHAPTER_4]: 'PARTE 02 – DESENVOLVIMENTO',
    },
};
//# sourceMappingURL=index.js.map