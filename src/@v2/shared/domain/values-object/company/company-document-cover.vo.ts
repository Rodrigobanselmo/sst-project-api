import { IDocumentTextProps } from "../../types/document/document-text-props.types";

export type ICompanyDocumentsCoverVO = {
  logoProps?: {
    maxLogoHeight?: number;
    maxLogoWidth?: number;
    x?: number;
    y?: number;
  };
  titleProps?: IDocumentTextProps;
  versionProps?: IDocumentTextProps;
  companyProps?: IDocumentTextProps;
  backgroundImagePath?: string;
}

export class CompanyDocumentsCoverVO {
  logoProps?: {
    maxLogoHeight?: number;
    maxLogoWidth?: number;
    x?: number;
    y?: number;
  };
  titleProps?: IDocumentTextProps;
  versionProps?: IDocumentTextProps;
  companyProps?: IDocumentTextProps;
  backgroundImagePath?: string;

  constructor(params: ICompanyDocumentsCoverVO) {
    this.logoProps = params.logoProps;
    this.titleProps = params.titleProps;
    this.versionProps = params.versionProps;
    this.companyProps = params.companyProps;
    this.backgroundImagePath = params.backgroundImagePath;
  }
}
