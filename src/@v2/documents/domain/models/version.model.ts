
export type IVersionModel = {
  version: string
  description: string | null
  approvedBy: string | null
  elaboratedBy: string | null
  revisionBy: string | null
  createdAt: Date;
  documentDate: Date | null;
  officialRevisionSeries?: number | null;
}

export class VersionModel {
  version: string
  description: string | null
  approvedBy: string | null
  elaboratedBy: string | null
  revisionBy: string | null
  createdAt: Date;
  documentDate: Date | null;
  officialRevisionSeries: number | null;

  constructor(params: IVersionModel) {
    this.version = params.version
    this.description = params.description
    this.approvedBy = params.approvedBy
    this.elaboratedBy = params.elaboratedBy
    this.revisionBy = params.revisionBy
    this.createdAt = params.createdAt
    this.documentDate = params.documentDate
    this.officialRevisionSeries = params.officialRevisionSeries ?? null
  }
}
