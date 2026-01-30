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
  /** The original URL or local path of the background image */
  backgroundImageUrl?: string;
  /** The downloaded local file path for the background image (used for document generation) */
  backgroundImagePath?: string;

  constructor(params: ICompanyDocumentsCoverVO) {
    this.logoProps = params.logoProps;
    this.titleProps = params.titleProps;
    this.versionProps = params.versionProps;
    this.companyProps = params.companyProps;
    // Store the original path as URL, and also keep it as the initial backgroundImagePath
    // (for local files like 'images/cover/simple.png')
    this.backgroundImageUrl = params.backgroundImagePath;
    this.backgroundImagePath = params.backgroundImagePath;
  }
}
