import { compare, hash } from 'bcrypt';
import { HashAdapter } from '../models/hash.interface';

export class BcryptHashAdapter implements HashAdapter {
  async createHash(password: string): Promise<string> {
    const passwordHash = await hash(password, 10);
    return passwordHash;
  }
  async compare(password: string, hash_password: string): Promise<boolean> {
    return compare(password, hash_password);
  }
}
