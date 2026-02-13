export namespace IVisualIdentityDAO {
  export type ReadParams = {
    companyId: string
  }

  export type VisualIdentityResult = {
    companyId: string
    companyName: string
    primaryColor: string | null
    shortName: string | null
    logoUrl: string | null
    customLogoUrl: string | null
    sidebarBackgroundColor: string | null
    applicationBackgroundColor: string | null
    visualIdentityEnabled: boolean
  } | null
}

