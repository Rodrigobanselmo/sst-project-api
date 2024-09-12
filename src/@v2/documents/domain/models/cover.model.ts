import { CoverTypeEnum } from "@/@v2/shared/domain/enum/company/cover-type.enum";
import { CompanyDocumentsCoverVO } from "@/@v2/shared/domain/values-object/company/company-document-cover.vo";

export type ICoverModel = {
  data: CompanyDocumentsCoverVO
  types: CoverTypeEnum[]
}

export class CoverModel {
  data: CompanyDocumentsCoverVO
  types: CoverTypeEnum[]

  constructor(params: ICoverModel) {
    this.data = params.data
    this.types = params.types
  }
}