export namespace IReadVisualIdentityUseCase {
  export type Params = {
    companyId: string
  }

  export type Result = {
    companyId: string
    companyName: string
    primaryColor: string | null
    shortName: string | null
    logoUrl: string | null
    visualIdentityEnabled: boolean
  } | null
}

