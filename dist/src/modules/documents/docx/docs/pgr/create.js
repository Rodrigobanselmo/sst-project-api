"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePgr = void 0;
const sectionTypeMap_1 = require("./constants/sectionTypeMap");
const mock_1 = require("./mock");
class CreatePgr {
    constructor({ version, logo }) {
        this.version = version;
        this.logo = logo;
        this.docSections = mock_1.docPGRSections;
    }
    create() {
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
        return [
            { placeholder: 'VERSAO_E_DATA_DO_DOCUMENTO', value: this.version },
            ...this.docSections.variables,
        ];
    }
    convertToSections(data) {
        const sections = [];
        const sectionProps = {
            logoPath: this.logo,
            version: this.version,
        };
        data.forEach((child) => {
            const section = (0, sectionTypeMap_1.sectionTypeMap)(sectionProps)[child.type](child, this.getVariables());
            if (Array.isArray(section)) {
                return sections.push(...section);
            }
            return sections.push(section);
        });
        return sections;
    }
}
exports.CreatePgr = CreatePgr;
//# sourceMappingURL=create.js.map