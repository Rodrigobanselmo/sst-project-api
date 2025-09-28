export interface CryptoAdapter {
  /**
   * Encrypts a value and returns a URL-safe base64 encoded string
   */
  encrypt(value: string): string;

  /**
   * Decrypts a URL-safe base64 encoded string and returns the original value
   */
  decrypt(encryptedValue: string): string;

  /**
   * Encrypts a number and returns a URL-safe base64 encoded string
   */
  encryptNumber(number: number): string;

  /**
   * Decrypts a URL-safe base64 encoded string and returns the number
   */
  decryptNumber(encryptedNumber: string): number;
}
