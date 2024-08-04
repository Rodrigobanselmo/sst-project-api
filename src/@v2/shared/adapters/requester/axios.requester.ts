import axios, { AxiosInstance } from 'axios'

import { DeleteParams, GetParams, PatchParams, PostParams, PutParams, Requester, Response } from './requester.interface'

export class AxiosRequester implements Requester {
  private readonly client: AxiosInstance

  constructor(baseURL?: string, headers?: Record<string, string>) {
    this.client = axios.create({ baseURL, headers })
  }

  async get<R extends object>(params: GetParams): Promise<Response<R>> {
    const { data, status } = await this.client.get(params.url, { params: params.queryParams, headers: params.headers })
    return { data, status }
  }

  async post<R extends object, P extends object>(params: PostParams<P>): Promise<Response<R>> {
    const { data, status } = await this.client.post(params.url, params.payload, { headers: params.headers })
    return { data, status }
  }

  async put<R extends object, P extends object>(params: PutParams<P>): Promise<Response<R>> {
    const { data, status } = await this.client.put(params.url, params.payload, { headers: params.headers })
    return { data, status }
  }

  async patch<R extends object, P extends object>(params: PatchParams<P>): Promise<Response<R>> {
    const { data, status } = await this.client.patch(params.url, params.payload, { headers: params.headers })
    return { data, status }
  }

  async delete<R extends object>(params: DeleteParams): Promise<Response<R>> {
    const { data, status } = await this.client.delete(params.url, { headers: params.headers })
    return { data, status }
  }
}
