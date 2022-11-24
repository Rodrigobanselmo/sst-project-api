"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementsMapClass = void 0;
const client_1 = require("@prisma/client");
const removeDuplicate_1 = require("../../../../../../shared/utils/removeDuplicate");
const bullets_1 = require("../../../base/elements/bullets");
const heading_1 = require("../../../base/elements/heading");
const paragraphs_1 = require("../../../base/elements/paragraphs");
const measureHierarch_1 = require("../../../components/images/measureHierarch");
const rsDocument_1 = require("../../../components/images/rsDocument");
const attachments_iterable_1 = require("../../../components/iterables/attachments/attachments.iterable");
const bullets_iterable_1 = require("../../../components/iterables/bullets/bullets.iterable");
const complementaryDocs_iterable_1 = require("../../../components/iterables/complementaryDocs/complementaryDocs.iterable");
const complementarySystems_iterable_1 = require("../../../components/iterables/complementarySystems/complementarySystems.iterable");
const emergency_iterable_1 = require("../../../components/iterables/emergency/emergency.iterable");
const professionals_iterable_1 = require("../../../components/iterables/professionals/professionals.iterable");
const recommendations_iterable_1 = require("../../../components/iterables/recommendations/recommendations.iterable");
const signatures_iterable_1 = require("../../../components/iterables/signatures/signatures.iterable");
const actionPlan_section_1 = require("../../../components/tables/actionPlan/actionPlan.section");
const hierarchyHomoOrg_section_1 = require("../../../components/tables/hierarchyHomoOrg/hierarchyHomoOrg.section");
const hierarchyPrioritization_page_1 = require("../../../components/tables/hierarchyPrioritization/hierarchyPrioritization.page");
const hierarchyRisks_section_1 = require("../../../components/tables/hierarchyRisks/hierarchyRisks.section");
const expositionDegreeTable_1 = require("../../../components/tables/mock/components/expositionDegree/section/expositionDegreeTable");
const healthEffectTable_1 = require("../../../components/tables/mock/components/healthSeverity/section/healthEffectTable");
const table_component_1 = require("../../../components/tables/mock/components/matriz/table.component");
const quantityResultsTable_1 = require("../../../components/tables/mock/components/quantityResults/section/quantityResultsTable");
const quantityHeat_table_1 = require("../../../components/tables/quantity/quantityHeat/quantityHeat.table");
const quantityNoise_table_1 = require("../../../components/tables/quantity/quantityNoise/quantityNoise.table");
const quantityQui_table_1 = require("../../../components/tables/quantity/quantityQui/quantityQui.table");
const quantityRad_table_1 = require("../../../components/tables/quantity/quantityRad/quantityRad.table");
const quantityVFB_table_1 = require("../../../components/tables/quantity/quantityVFB/quantityVFB.table");
const quantityVL_table_1 = require("../../../components/tables/quantity/quantityVL/quantityVL.table");
const riskCharacterization_section_1 = require("../../../components/tables/riskCharacterization/riskCharacterization.section");
const versionControl_table_1 = require("../../../components/tables/versionControl/versionControl.table");
const convertToDocx_1 = require("../functions/convertToDocx");
const elements_types_1 = require("../types/elements.types");
const paragraphs_2 = require("./../../../base/elements/paragraphs");
class ElementsMapClass {
    constructor({ variables, versions, professionals, characterizations, environments, document, homogeneousGroup, hierarchy, attachments, hierarchyTree, workspace, }) {
        this.map = {
            [elements_types_1.PGRSectionChildrenTypeEnum.H1]: ({ text }) => [(0, heading_1.h1)(text)],
            [elements_types_1.PGRSectionChildrenTypeEnum.H2]: ({ text }) => [(0, heading_1.h2)(text)],
            [elements_types_1.PGRSectionChildrenTypeEnum.H3]: ({ text }) => [(0, heading_1.h3)(text)],
            [elements_types_1.PGRSectionChildrenTypeEnum.H4]: ({ text }) => [(0, heading_1.h4)(text)],
            [elements_types_1.PGRSectionChildrenTypeEnum.H5]: ({ text }) => [(0, heading_1.h5)(text)],
            [elements_types_1.PGRSectionChildrenTypeEnum.H6]: ({ text }) => [(0, heading_1.h6)(text)],
            [elements_types_1.PGRSectionChildrenTypeEnum.BREAK]: ({}) => [(0, paragraphs_1.pageBreak)()],
            [elements_types_1.PGRSectionChildrenTypeEnum.TITLE]: ({ text }) => [(0, heading_1.title)(text)],
            [elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH]: (_a) => {
                var { text } = _a, rest = __rest(_a, ["text"]);
                return [(0, paragraphs_1.paragraphNormal)(text, rest)];
            },
            [elements_types_1.PGRSectionChildrenTypeEnum.LEGEND]: (_a) => {
                var { text } = _a, rest = __rest(_a, ["text"]);
                return [(0, paragraphs_1.paragraphTableLegend)(text, rest)];
            },
            [elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE]: (_a) => {
                var { text } = _a, rest = __rest(_a, ["text"]);
                return [(0, paragraphs_2.paragraphTable)(text, rest)];
            },
            [elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_FIGURE]: (_a) => {
                var { text } = _a, rest = __rest(_a, ["text"]);
                return [(0, paragraphs_2.paragraphFigure)(text, rest)];
            },
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_VERSION_CONTROL]: () => [(0, versionControl_table_1.versionControlTable)(this.versions)],
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_GSE]: () => (0, hierarchyHomoOrg_section_1.hierarchyHomoOrgSection)(this.hierarchy, this.homogeneousGroup, {
                showDescription: false,
                showHomogeneous: true,
                showHomogeneousDescription: true,
            })['children'],
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_HIERARCHY_ENV]: () => (0, hierarchyHomoOrg_section_1.hierarchyHomoOrgSection)(this.hierarchy, this.homogeneousGroup, {
                showDescription: false,
                showHomogeneous: true,
                type: client_1.HomoTypeEnum.ENVIRONMENT,
            })['children'],
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_HIERARCHY_CHAR]: () => (0, hierarchyHomoOrg_section_1.hierarchyHomoOrgSection)(this.hierarchy, this.homogeneousGroup, {
                showDescription: false,
                showHomogeneous: true,
                type: [client_1.HomoTypeEnum.ACTIVITIES, client_1.HomoTypeEnum.EQUIPMENT, client_1.HomoTypeEnum.WORKSTATION],
            })['children'],
            [elements_types_1.PGRSectionChildrenTypeEnum.PROFESSIONALS_SIGNATURES]: () => (0, signatures_iterable_1.signaturesIterable)(this.professionals, this.workspace, (x, v) => this.convertToDocx(x, v)),
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION]: () => (0, hierarchyPrioritization_page_1.hierarchyPrioritizationPage)(this.document, this.hierarchy, this.hierarchyTree, {
                isByGroup: true,
            }, (x, v) => this.convertToDocx(x, v)),
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY]: () => (0, hierarchyPrioritization_page_1.hierarchyPrioritizationPage)(this.document, this.hierarchy, this.hierarchyTree, {
                isByGroup: true,
                homoType: client_1.HomoTypeEnum.HIERARCHY,
            }, (x, v) => this.convertToDocx(x, v)),
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV]: () => (0, hierarchyPrioritization_page_1.hierarchyPrioritizationPage)(this.document, this.hierarchy, this.hierarchyTree, {
                isByGroup: true,
                homoType: client_1.HomoTypeEnum.ENVIRONMENT,
            }, (x, v) => this.convertToDocx(x, v)),
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR]: () => (0, hierarchyPrioritization_page_1.hierarchyPrioritizationPage)(this.document, this.hierarchy, this.hierarchyTree, {
                isByGroup: true,
                homoType: [client_1.HomoTypeEnum.ACTIVITIES, client_1.HomoTypeEnum.EQUIPMENT, client_1.HomoTypeEnum.WORKSTATION],
            }, (x, v) => this.convertToDocx(x, v)),
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_QUANTITY_NOISE]: () => [(0, quantityNoise_table_1.quantityNoiseTable)(this.document, this.hierarchyTree)],
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT]: () => [(0, quantityHeat_table_1.quantityHeatTable)(this.document, this.hierarchyTree)],
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_QUANTITY_VFB]: () => [(0, quantityVFB_table_1.quantityVFBTable)(this.document, this.hierarchyTree)],
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_QUANTITY_VL]: () => [(0, quantityVL_table_1.quantityVLTable)(this.document, this.hierarchyTree)],
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_QUANTITY_RAD]: () => [(0, quantityRad_table_1.quantityRadTable)(this.document, this.hierarchyTree)],
            [elements_types_1.PGRSectionChildrenTypeEnum.TABLE_QUANTITY_QUI]: () => [(0, quantityQui_table_1.quantityQuiTable)(this.document, this.hierarchyTree)],
            [elements_types_1.PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_FIS]: () => {
                var _a;
                return (0, bullets_iterable_1.bulletTextIterable)((0, removeDuplicate_1.removeDuplicate)((((_a = this.document) === null || _a === void 0 ? void 0 : _a.data) || []).map((riskData) => !!(riskData.riskFactor.type === client_1.RiskFactorsEnum.FIS) && riskData.riskFactor.name).filter((x) => x), { simpleCompare: true }), (x, v) => this.convertToDocx(x, v));
            },
            [elements_types_1.PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_QUI]: () => {
                var _a;
                return (0, bullets_iterable_1.bulletTextIterable)((0, removeDuplicate_1.removeDuplicate)((((_a = this.document) === null || _a === void 0 ? void 0 : _a.data) || []).map((riskData) => !!(riskData.riskFactor.type === client_1.RiskFactorsEnum.QUI) && riskData.riskFactor.name).filter((x) => x), { simpleCompare: true }), (x, v) => this.convertToDocx(x, v));
            },
            [elements_types_1.PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_BIO]: () => {
                var _a;
                return (0, bullets_iterable_1.bulletTextIterable)((0, removeDuplicate_1.removeDuplicate)((((_a = this.document) === null || _a === void 0 ? void 0 : _a.data) || []).map((riskData) => !!(riskData.riskFactor.type === client_1.RiskFactorsEnum.BIO) && riskData.riskFactor.name).filter((x) => x), { simpleCompare: true }), (x, v) => this.convertToDocx(x, v));
            },
            [elements_types_1.PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_ERG]: () => {
                var _a;
                return (0, bullets_iterable_1.bulletTextIterable)((0, removeDuplicate_1.removeDuplicate)((((_a = this.document) === null || _a === void 0 ? void 0 : _a.data) || []).map((riskData) => !!(riskData.riskFactor.type === client_1.RiskFactorsEnum.ERG) && riskData.riskFactor.name).filter((x) => x), { simpleCompare: true }), (x, v) => this.convertToDocx(x, v));
            },
            [elements_types_1.PGRSectionChildrenTypeEnum.ITERABLE_QUALITY_ACI]: () => {
                var _a;
                return (0, bullets_iterable_1.bulletTextIterable)((0, removeDuplicate_1.removeDuplicate)((((_a = this.document) === null || _a === void 0 ? void 0 : _a.data) || []).map((riskData) => !!(riskData.riskFactor.type === client_1.RiskFactorsEnum.ACI) && riskData.riskFactor.name).filter((x) => x), { simpleCompare: true }), (x, v) => this.convertToDocx(x, v));
            },
            [elements_types_1.PGRSectionChildrenTypeEnum.BULLET]: (_a) => {
                var { level = 0, text } = _a, rest = __rest(_a, ["level", "text"]);
                return [(0, bullets_1.bulletsNormal)(text, level, rest)];
            },
            [elements_types_1.PGRSectionChildrenTypeEnum.BULLET_SPACE]: ({ text }) => [(0, bullets_1.bulletsSpace)(text)],
            [elements_types_1.PGRSectionChildrenTypeEnum.PROFESSIONAL]: () => (0, professionals_iterable_1.professionalsIterable)(this.professionals, this.workspace, (x, v) => this.convertToDocx(x, v)),
            [elements_types_1.PGRSectionChildrenTypeEnum.COMPLEMENTARY_DOCS]: () => (0, complementaryDocs_iterable_1.complementaryDocsIterable)(this.document.complementaryDocs || [], (x, v) => this.convertToDocx(x, v)),
            [elements_types_1.PGRSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS]: () => (0, complementarySystems_iterable_1.complementarySystemsIterable)(this.document.complementarySystems || [], (x, v) => this.convertToDocx(x, v)),
            [elements_types_1.PGRSectionChildrenTypeEnum.ITERABLE_RECOMMENDATIONS]: () => { var _a; return (0, recommendations_iterable_1.recommendationsIterable)(((_a = this.document) === null || _a === void 0 ? void 0 : _a.data) || [], (x, v) => this.convertToDocx(x, v)); },
            [elements_types_1.PGRSectionChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS]: () => { var _a; return (0, emergency_iterable_1.emergencyIterable)(((_a = this.document) === null || _a === void 0 ? void 0 : _a.data) || [], (x, v) => this.convertToDocx(x, v)); },
            [elements_types_1.PGRSectionChildrenTypeEnum.ATTACHMENTS]: () => (0, attachments_iterable_1.attachmentsIterable)(this.attachments || [], (x, v) => this.convertToDocx(x, v)),
            [elements_types_1.PGRSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES]: () => (0, healthEffectTable_1.healthEffectTable)((x, v) => this.convertToDocx(x, v)),
            [elements_types_1.PGRSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES]: () => (0, expositionDegreeTable_1.expositionDegreeTable)((x, v) => this.convertToDocx(x, v)),
            [elements_types_1.PGRSectionChildrenTypeEnum.MATRIX_TABLES]: () => [(0, table_component_1.matrizTable)()],
            [elements_types_1.PGRSectionChildrenTypeEnum.MEASURE_IMAGE]: () => (0, measureHierarch_1.measureHierarchyImage)(),
            [elements_types_1.PGRSectionChildrenTypeEnum.RS_IMAGE]: () => (0, rsDocument_1.rsDocumentImage)(),
            [elements_types_1.PGRSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES]: () => (0, quantityResultsTable_1.quantityResultsTable)((x, v) => this.convertToDocx(x, v)),
            [elements_types_1.PGRSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE]: () => (0, hierarchyHomoOrg_section_1.hierarchyHomoOrgSection)(this.hierarchy, this.homogeneousGroup, {
                showDescription: false,
                showHomogeneous: false,
                showHomogeneousDescription: false,
            })['children'],
            [elements_types_1.PGRSectionChildrenTypeEnum.RISK_TABLE]: () => (0, riskCharacterization_section_1.riskCharacterizationTableSection)(this.document)['children'],
            [elements_types_1.PGRSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE]: () => (0, hierarchyRisks_section_1.hierarchyRisksTableAllSections)(this.document, this.hierarchy, this.hierarchyTree, (x, v) => this.convertToDocx(x, v)),
            [elements_types_1.PGRSectionChildrenTypeEnum.PLAN_TABLE]: () => (0, actionPlan_section_1.actionPlanTableSection)(this.document, this.hierarchyTree)['children'],
        };
        this.variables = variables;
        this.versions = versions;
        this.professionals = professionals;
        this.environments = environments;
        this.characterizations = characterizations;
        this.document = document;
        this.homogeneousGroup = homogeneousGroup;
        this.hierarchy = hierarchy;
        this.attachments = attachments;
        this.hierarchyTree = hierarchyTree;
        this.workspace = workspace;
    }
    convertToDocx(data, variables = {}) {
        return data
            .map((child) => {
            const childData = (0, convertToDocx_1.convertToDocxHelper)(child, Object.assign(Object.assign({}, this.variables), variables));
            if (!childData)
                return null;
            return this.map[childData.type](childData);
        })
            .filter((x) => x)
            .reduce((acc, curr) => {
            return [...acc, ...curr];
        }, []);
    }
}
exports.ElementsMapClass = ElementsMapClass;
//# sourceMappingURL=elementTypeMap.js.map