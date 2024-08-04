import { AsyncLocalStorage } from 'async_hooks'

export const asyncLocalStorage = new AsyncLocalStorage()

function get<T = any>(key: string): T {
  return asyncLocalStorage.getStore()?.[key]
}

function set<T = any>(key: string, value: T): void {
  const store = asyncLocalStorage.getStore() || {}
  store[key] = value
  asyncLocalStorage.enterWith(store)
}

export default { get, set }
