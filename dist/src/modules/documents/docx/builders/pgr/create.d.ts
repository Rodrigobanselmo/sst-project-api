import { ISectionOptions } from 'docx';
import { ICreatePGR } from './types/pgr.types';
export declare class DocumentBuildPGR {
    private version;
    private logoImagePath;
    private consultantLogoImagePath;
    private cover;
    private company;
    private workspace;
    private docSections;
    private versions;
    private variables;
    private environments;
    private document;
    private homogeneousGroup;
    private hierarchy;
    private characterizations;
    private attachments;
    private hierarchyTree;
    constructor({ version, logo, consultantLogo, company, workspace, versions, environments, document, homogeneousGroup, hierarchy, characterizations, attachments, hierarchyTree, cover, }: ICreatePGR);
    build(): ISectionOptions[];
    private getVariables;
    private convertToSections;
}
