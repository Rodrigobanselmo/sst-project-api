
export namespace IEditCommentUseCase {
  export type Params = {
    companyId: string
    ids?: number[];
    isApproved?: boolean;
    approvedComment?: string | null;
  }
}
