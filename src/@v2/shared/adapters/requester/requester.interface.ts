type Headers = Record<string, string>

type BasicParams = {
  url: string
  headers?: Headers
}

export type GetParams = {
  queryParams?: Record<string, string>
} & BasicParams

export type PostParams<P extends object> = {
  payload: P
} & BasicParams

export type PutParams<P extends object> = {
  payload: P
} & BasicParams

export type PatchParams<P extends object> = {
  payload: P
} & BasicParams

export type DeleteParams = BasicParams

export type Response<D extends object> = {
  data?: D
  status: number
}

export interface Requester {
  get<R extends object>(params: GetParams): Promise<Response<R>>

  post<R extends object, P extends object>(params: PostParams<P>): Promise<Response<R>>
  post<R extends object>(params: PostParams<any>): Promise<Response<R>>

  put<R extends object, P extends object>(params: PutParams<P>): Promise<Response<R>>

  patch<R extends object, P extends object>(params: PatchParams<P>): Promise<Response<R>>

  delete<R extends object>(params: DeleteParams): Promise<Response<R>>
}
