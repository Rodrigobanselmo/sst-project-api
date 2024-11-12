
export namespace IEditCommentService {
  export type Params = {
    id: string
    companyId: string
    userId: number
    isApproved: boolean;
    approvedComment?: string | null;
  }
}
