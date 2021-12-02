interface IHashProvider {
  compare(password: string, hash_password: string): Promise<boolean>;
  createHash(password: string): Promise<string>;
}

export { IHashProvider };
