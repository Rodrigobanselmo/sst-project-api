import { AxiosRequester } from './axios.requester'
import { Requester } from './requester.interface'

export class RequesterFactory {
  static create(baseURL?: string, headers?: Record<string, string>): Requester {
    return new AxiosRequester(baseURL, headers)
  }
}
