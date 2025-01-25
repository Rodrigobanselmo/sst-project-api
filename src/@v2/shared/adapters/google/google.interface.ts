import { UserCredential } from 'firebase/auth';

export interface GoogleAdapter {
  validateGoogleToken(token: string): Promise<UserCredential>;
}
