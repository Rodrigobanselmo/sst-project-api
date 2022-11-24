import { DocumentCoverEntity } from './../../../../../company/entities/document-cover.entity';
import { CompanyEntity } from './../../../../../company/entities/company.entity';
import { CharacterizationEntity } from './../../../../../company/entities/characterization.entity';
import { ISectionOptions } from 'docx';
import { HierarchyMapData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { IAllSectionTypesPGR, IDocVariables } from '../types/section.types';
import { RiskFactorGroupDataEntity } from '../../../../../sst/entities/riskGroupData.entity';
import { EnvironmentEntity } from './../../../../../company/entities/environment.entity';
import { IMapElementDocumentType } from './elementTypeMap';
declare type IMapSectionDocumentType = Record<string, (arg: IAllSectionTypesPGR) => ISectionOptions | ISectionOptions[]>;
declare type IDocumentClassType = {
    variables?: IDocVariables;
    consultantLogoImagePath: string;
    logoImagePath?: string;
    version?: string;
    cover: DocumentCoverEntity;
    elementsMap: IMapElementDocumentType;
    document: RiskFactorGroupDataEntity;
    homogeneousGroup: IHomoGroupMap;
    hierarchy: Map<string, HierarchyMapData>;
    characterizations: CharacterizationEntity[];
    environments: EnvironmentEntity[];
    company: CompanyEntity;
};
export declare class SectionsMapClass {
    private variables;
    private logoPath;
    private consultantLogoPath;
    private version;
    private elementsMap;
    private cover;
    private document;
    private homogeneousGroup;
    private environments;
    private characterizations;
    private hierarchy;
    private company;
    constructor({ variables, cover, company, version, logoImagePath, elementsMap, document, hierarchy, homogeneousGroup, environments, characterizations, consultantLogoImagePath, }: IDocumentClassType);
    map: IMapSectionDocumentType;
    getFooterHeader: (footerText: string) => {
        footers: {
            default: import("docx").Footer;
            first: import("docx").Footer;
        };
        headers: {
            default: import("docx").Header;
            first: import("docx").Header;
        };
        properties: import("docx").ISectionPropertiesOptions;
    };
    private convertToDocx;
}
export {};
