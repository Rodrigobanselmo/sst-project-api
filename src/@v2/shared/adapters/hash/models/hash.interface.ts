export interface HashAdapter {
  compare(password: string, hashPassword: string): Promise<boolean>;
  createHash(password: string): Promise<string>;
}
