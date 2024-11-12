
export namespace IEditCommentUseCase {
  export type Params = {
    ids?: string[];
    companyId: string
    isApproved?: boolean;
    approvedComment?: string | null;
  }
}
