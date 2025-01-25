import { isValidEmail as IsValidEmail } from '@brazilian-utils/brazilian-utils';

export function isValidEmail(email: string) {
  return IsValidEmail(email);
}
