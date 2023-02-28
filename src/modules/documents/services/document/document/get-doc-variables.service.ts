import { docPGRSections } from './../../../docx/builders/pgr/mock/index';
import { documentSectionTypeMap } from './../../../constants/documentSectionType.constant';
import { DocumentSectionChildrenTypeEnum } from './../../../docx/builders/pgr/types/elements.types';
import { documentElementTypeMap } from './../../../constants/documentElementType.constant';
import { variableMap } from './../../../constants/variables.constant';
import { VariablesPGREnum } from './../../../docx/builders/pgr/enums/variables.enum';
import { Injectable } from '@nestjs/common';

import { IGetDocumentModel, UploadDocumentDto } from '../../../dto/document.dto';
import { DocumentPGRFactory } from '../../../factories/document/products/PGR/DocumentPGRFactory';
import { DocumentSectionTypeEnum } from '../../../docx/builders/pgr/types/section.types';
import { v4 } from 'uuid';
import clone from 'clone';

@Injectable()
export class GetDocVariablesService {
  constructor(private readonly documentPGRFactory: DocumentPGRFactory) {}
  async execute(body: IGetDocumentModel) {
    const mainData = this.main();
    let documentData = { variables: [], elements: [], sections: [] };

    if (body.type == 'PGR') {
      documentData = this.pgr();
    }

    return {
      document: this.document(),
      variables: [...mainData.variables, ...documentData.variables],
      elements: [...mainData.elements, ...documentData.elements],
      sections: [...mainData.sections, ...documentData.sections],
    };
  }

  private main() {
    const variables = [
      variableMap[VariablesPGREnum.COMPANY_CEP],
      variableMap[VariablesPGREnum.COMPANY_CITY],
      variableMap[VariablesPGREnum.COMPANY_CNPJ],
      variableMap[VariablesPGREnum.COMPANY_EMAIL],
      variableMap[VariablesPGREnum.COMPANY_SIGNER_CITY],
      variableMap[VariablesPGREnum.COMPANY_NAME],
      variableMap[VariablesPGREnum.COMPANY_NEIGHBOR],
      variableMap[VariablesPGREnum.COMPANY_NUMBER],
      variableMap[VariablesPGREnum.COMPANY_CNAE],
      variableMap[VariablesPGREnum.COMPANY_RISK_DEGREE],
      variableMap[VariablesPGREnum.COMPANY_INITIAL],
      variableMap[VariablesPGREnum.COMPANY_SHORT_NAME],
      variableMap[VariablesPGREnum.COMPANY_STATE],
      variableMap[VariablesPGREnum.COMPANY_EMPLOYEES_TOTAL],
      variableMap[VariablesPGREnum.COMPANY_STREET],
      variableMap[VariablesPGREnum.COMPANY_TELEPHONE],
      variableMap[VariablesPGREnum.COMPANY_MISSION],
      variableMap[VariablesPGREnum.COMPANY_VISION],
      variableMap[VariablesPGREnum.COMPANY_VALUES],
      variableMap[VariablesPGREnum.COMPANY_RESPONSIBLE],
      variableMap[VariablesPGREnum.COMPANY_WORK_TIME],
      variableMap[VariablesPGREnum.CONSULTANT_NAME],
      variableMap[VariablesPGREnum.DOC_VALIDITY],
      variableMap[VariablesPGREnum.DOCUMENT_COMPLEMENTARY_SYSTEMS],
      variableMap[VariablesPGREnum.DOCUMENT_COMPLEMENTARY_DOCS],
      variableMap[VariablesPGREnum.DOCUMENT_COORDINATOR],
      variableMap[VariablesPGREnum.VERSION],

      variableMap[VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS],
      variableMap[VariablesPGREnum.PROFESSIONAL_CREA],
      variableMap[VariablesPGREnum.PROFESSIONAL_FORMATION],
      variableMap[VariablesPGREnum.PROFESSIONAL_NAME],
      variableMap[VariablesPGREnum.PROFESSIONAL_CPF],

      variableMap[VariablesPGREnum.ATTACHMENT_LINK],
      variableMap[VariablesPGREnum.ATTACHMENT_NAME],

      variableMap[VariablesPGREnum.BULLET_TEXT],

      //boolean
      variableMap[VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION],
      variableMap[VariablesPGREnum.IS_RS],
      variableMap[VariablesPGREnum.HAS_EMERGENCY_PLAN],
      variableMap[VariablesPGREnum.IS_WORKSPACE_OWNER],
      variableMap[VariablesPGREnum.IS_NOT_WORKSPACE_OWNER],
      variableMap[VariablesPGREnum.HAS_RISK_FIS],
      variableMap[VariablesPGREnum.HAS_RISK_QUI],
      variableMap[VariablesPGREnum.HAS_RISK_BIO],
      variableMap[VariablesPGREnum.HAS_RISK_ERG],
      variableMap[VariablesPGREnum.HAS_RISK_ACI],
    ];

    const elements = [
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TITLE],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.H1],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.H2],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.H3],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.H4],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.H5],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.H6],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.PARAGRAPH],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.BREAK],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.BULLET],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.BULLET_SPACE],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_VERSION_CONTROL],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ATTACHMENTS],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.LEGEND],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.PROFESSIONAL],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.PROFESSIONALS_SIGNATURES],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.PARAGRAPH_FIGURE],
    ];

    const sections = [
      documentSectionTypeMap[DocumentSectionTypeEnum.CHAPTER],
      documentSectionTypeMap[DocumentSectionTypeEnum.TOC],
      documentSectionTypeMap[DocumentSectionTypeEnum.COVER],
      documentSectionTypeMap[DocumentSectionTypeEnum.SECTION],
    ];

    return { variables, elements, sections };
  }

  private pgr() {
    const variables = [
      variableMap[VariablesPGREnum.CHAPTER_1],
      variableMap[VariablesPGREnum.CHAPTER_2],
      variableMap[VariablesPGREnum.CHAPTER_3],
      variableMap[VariablesPGREnum.CHAPTER_4],
      variableMap[VariablesPGREnum.WORKSPACE_CNPJ],
      variableMap[VariablesPGREnum.ENVIRONMENT_DESCRIPTION],
      variableMap[VariablesPGREnum.ENVIRONMENT_GENERAL_DESCRIPTION],
      variableMap[VariablesPGREnum.ENVIRONMENT_IMAGES],
      variableMap[VariablesPGREnum.ENVIRONMENT_MOISTURE],
      variableMap[VariablesPGREnum.ENVIRONMENT_NOISE],
      variableMap[VariablesPGREnum.ENVIRONMENT_LUMINOSITY],
      variableMap[VariablesPGREnum.ENVIRONMENT_TEMPERATURE],
      variableMap[VariablesPGREnum.ENVIRONMENT_NAME],
      variableMap[VariablesPGREnum.PROFILE_NAME],
      variableMap[VariablesPGREnum.CHARACTERIZATION_NAME],

      //boolean
      variableMap[VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_GENERAL],
      variableMap[VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_ADM],
      variableMap[VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_OP],
      variableMap[VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_SUP],
      variableMap[VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_ACT],
      variableMap[VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_WORK],
      variableMap[VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_EQUIP],
      variableMap[VariablesPGREnum.COMPANY_HAS_ENVIRONMENT_RISK],
      variableMap[VariablesPGREnum.COMPANY_HAS_CHARACTERIZATION_RISK],
      variableMap[VariablesPGREnum.COMPANY_HAS_HIERARCHY_RISK],
      variableMap[VariablesPGREnum.COMPANY_HAS_GSE_RISK],
      variableMap[VariablesPGREnum.HAS_QUANTITY],
      variableMap[VariablesPGREnum.IS_Q5],
      variableMap[VariablesPGREnum.HAS_QUANTITY_NOISE],
      variableMap[VariablesPGREnum.HAS_QUANTITY_QUI],
      variableMap[VariablesPGREnum.HAS_QUANTITY_VFB],
      variableMap[VariablesPGREnum.HAS_QUANTITY_VL],
      variableMap[VariablesPGREnum.HAS_QUANTITY_RAD],
      variableMap[VariablesPGREnum.HAS_QUANTITY_HEAT],
      variableMap[VariablesPGREnum.HAS_EMERGENCY],
      variableMap[VariablesPGREnum.HAS_HEAT],
      variableMap[VariablesPGREnum.HAS_VFB],
      variableMap[VariablesPGREnum.HAS_VL],
    ];

    const elements = [
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_ADM],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_OP],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_SUP],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_ENVIRONMENTS_GENERAL],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_EQUIP],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_ACTIVIT],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_CHARACTERIZATION_WORKSTATION],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_RECOMMENDATIONS],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_EMERGENCY_RISKS],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_GSE],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_ENV],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_HIERARCHY_CHAR],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_ENV],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_CHAR],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_PRIORITIZATION_HIERARCHY],

      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_FIS],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_QUI],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_BIO],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ERG],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.ITERABLE_QUALITY_ACI],

      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_NOISE],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_QUI],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_HEAT],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VFB],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_VL],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.TABLE_QUANTITY_RAD],

      documentElementTypeMap[DocumentSectionChildrenTypeEnum.HIERARCHY_RISK_TABLE],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.RISK_TABLE],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.MEASURE_IMAGE],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.RS_IMAGE],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.COMPLEMENTARY_DOCS],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.COMPLEMENTARY_SYSTEMS],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.EXPOSITION_DEGREE_TABLES],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.HIERARCHY_ORG_TABLE],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.QUANTITY_RESULTS_TABLES],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.QUANTITY_CONSIDERATION_TABLES],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.MATRIX_TABLES],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.APR_TABLE],
      documentElementTypeMap[DocumentSectionChildrenTypeEnum.PLAN_TABLE],
    ];

    const sections = [
      documentSectionTypeMap[DocumentSectionTypeEnum.APR],
      documentSectionTypeMap[DocumentSectionTypeEnum.ITERABLE_ENVIRONMENTS],
      documentSectionTypeMap[DocumentSectionTypeEnum.ITERABLE_CHARACTERIZATION],
    ];

    return { variables, elements, sections };
  }

  private document() {
    const data = [];
    docPGRSections.sections.forEach((section) => {
      data: section.data.forEach((item) => {
        data.push({
          ...item,
          id: v4(),
          ...('children' in item && {
            children: item.children.map((child) => ({
              id: v4(),
              ...child,
            })),
          }),
        });
      });
    });

    // data = data.reduce((accs, section) => {
    //   const acc = clone(accs);
    //   if (!section.children) return [...acc, section];

    //   const last = acc[acc.length - 1];
    //   const isEqual =
    //     last.footerText == section.footerText &&
    //     section.type == DocumentSectionTypeEnum.SECTION &&
    //     section.children &&
    //     !section.properties &&
    //     !section.removeWithSomeEmptyVars &&
    //     !section.removeWithAllEmptyVars &&
    //     !section.removeWithAllValidVars &&
    //     !section.addWithAllVars;

    //   if (!isEqual) return [...acc, section];

    //   if (isEqual) {
    //     acc[acc.length - 1].children = [...acc[acc.length - 1].children, ...section.children];
    //   }

    //   return acc;
    // }, [] as any[]);

    return {
      sections: [{ data }],
      variables: Object.entries(docPGRSections.variables).map(([key, value]) => ({
        label: value,
        type: key,
      })),
    };
  }
}
