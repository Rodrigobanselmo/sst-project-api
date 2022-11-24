import { IHashProvider } from '../models/IHashProvider.types';
declare class HashProvider implements IHashProvider {
    createHash(password: string): Promise<string>;
    compare(password: string, hash_password: string): Promise<boolean>;
}
export { HashProvider };
