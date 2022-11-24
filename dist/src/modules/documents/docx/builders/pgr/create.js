"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentBuildPGR = void 0;
const variables_enum_1 = require("./enums/variables.enum");
const company_variables_1 = require("./functions/getVariables/company.variables");
const elementTypeMap_1 = require("./maps/elementTypeMap");
const sectionTypeMap_1 = require("./maps/sectionTypeMap");
const mock_1 = require("./mock");
const boolean_variables_1 = require("./functions/getVariables/boolean.variables");
class DocumentBuildPGR {
    constructor({ version, logo, consultantLogo, company, workspace, versions, environments, document, homogeneousGroup, hierarchy, characterizations, attachments, hierarchyTree, cover, }) {
        this.version = version;
        this.logoImagePath = logo;
        this.cover = cover;
        this.consultantLogoImagePath = consultantLogo;
        this.company = company;
        this.workspace = workspace;
        this.docSections = mock_1.docPGRSections;
        this.versions = versions;
        this.environments = environments;
        this.document = document;
        this.homogeneousGroup = homogeneousGroup;
        this.hierarchy = hierarchy;
        this.characterizations = characterizations;
        this.attachments = attachments;
        this.hierarchyTree = hierarchyTree;
        this.variables = this.getVariables();
    }
    build() {
        const sections = this.docSections.sections
            .map((docSection) => {
            return this.convertToSections(docSection.data);
        })
            .reduce((acc, result) => {
            if (Array.isArray(result)) {
                return [...acc, ...result];
            }
            return [...acc, result];
        }, []);
        return sections;
    }
    getVariables() {
        var _a, _b, _c;
        return Object.assign(Object.assign(Object.assign({ [variables_enum_1.VariablesPGREnum.VERSION]: this.version, [variables_enum_1.VariablesPGREnum.DOC_VALIDITY]: this.versions[0].validity, [variables_enum_1.VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION]: ((_b = (_a = this.document) === null || _a === void 0 ? void 0 : _a.complementarySystems) === null || _b === void 0 ? void 0 : _b.length) > 0 ? 'true' : '', [variables_enum_1.VariablesPGREnum.DOCUMENT_COORDINATOR]: ((_c = this.document) === null || _c === void 0 ? void 0 : _c.coordinatorBy) || '' }, (0, company_variables_1.companyVariables)(this.company, this.workspace, this.workspace.address)), (0, boolean_variables_1.booleanVariables)(this.company, this.workspace, this.hierarchy, this.document)), this.docSections.variables);
    }
    convertToSections(data) {
        var _a, _b, _c, _d, _e, _f;
        const sections = [];
        const elementsMap = new elementTypeMap_1.ElementsMapClass({
            versions: this.versions,
            variables: this.variables,
            professionals: [...(((_a = this.document) === null || _a === void 0 ? void 0 : _a.professionals) || []), ...(((_b = this.document) === null || _b === void 0 ? void 0 : _b.users) || [])],
            environments: (_c = this.environments) !== null && _c !== void 0 ? _c : [],
            characterizations: (_d = this.characterizations) !== null && _d !== void 0 ? _d : [],
            document: this.document,
            homogeneousGroup: this.homogeneousGroup,
            hierarchy: this.hierarchy,
            attachments: this.attachments,
            hierarchyTree: this.hierarchyTree,
            workspace: this.workspace,
        }).map;
        const sectionsMap = new sectionTypeMap_1.SectionsMapClass({
            variables: this.variables,
            logoImagePath: this.logoImagePath,
            consultantLogoImagePath: this.consultantLogoImagePath,
            version: this.version,
            elementsMap,
            document: this.document,
            homogeneousGroup: this.homogeneousGroup,
            hierarchy: this.hierarchy,
            environments: (_e = this.environments) !== null && _e !== void 0 ? _e : [],
            characterizations: (_f = this.characterizations) !== null && _f !== void 0 ? _f : [],
            company: this.company,
            cover: this.cover,
        }).map;
        data.forEach((child) => {
            if ('removeWithSomeEmptyVars' in child) {
                const isEmpty = child.removeWithSomeEmptyVars.some((variable) => !this.variables[variable]);
                if (isEmpty) {
                    return null;
                }
            }
            if ('removeWithAllEmptyVars' in child) {
                const isEmpty = child.removeWithAllEmptyVars.every((variable) => !this.variables[variable]);
                if (isEmpty) {
                    return null;
                }
            }
            if ('removeWithAllValidVars' in child) {
                const isNotEmpty = child.removeWithAllValidVars.every((variable) => this.variables[variable]);
                if (isNotEmpty) {
                    return null;
                }
            }
            if ('addWithAllVars' in child) {
                const isNotEmpty = child.addWithAllVars.every((variable) => this.variables[variable]);
                if (!isNotEmpty) {
                    return null;
                }
            }
            const section = sectionsMap[child.type](child);
            if (Array.isArray(section)) {
                return sections.push(...section);
            }
            return sections.push(section);
        });
        return sections;
    }
}
exports.DocumentBuildPGR = DocumentBuildPGR;
//# sourceMappingURL=create.js.map