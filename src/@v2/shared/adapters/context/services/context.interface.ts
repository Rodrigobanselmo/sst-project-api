export interface LocalContext {
  set<T>(key: string, value: T): void
  get<T>(key: string): T
}
