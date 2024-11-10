
export namespace IStatusUseCase {
  export type Params = {
    id: number
    name?: string
    companyId: string
    color?: string | null
  }
}
