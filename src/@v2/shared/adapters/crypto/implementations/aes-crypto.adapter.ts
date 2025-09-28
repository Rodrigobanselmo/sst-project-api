import { Injectable, BadRequestException } from '@nestjs/common';
import { createCipheriv, createDecipheriv } from 'crypto';
import { CryptoAdapter } from '../models/crypto.interface';

@Injectable()
export class AesCryptoAdapter implements CryptoAdapter {
  private readonly algorithm = 'aes-256-cbc';
  private readonly secretKey: Buffer;
  private readonly iv: Buffer;

  constructor() {
    // Use environment variable or generate a secure default secret key
    const secretKeyString = process.env.CRYPTO_SECRET_KEY || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'; // 32 characters
    this.secretKey = Buffer.from(secretKeyString, 'utf8');

    // Ensure the secret key is exactly 32 bytes for AES-256
    if (this.secretKey.length !== 32) {
      throw new Error('CRYPTO_SECRET_KEY must be exactly 32 characters long');
    }

    // Use a fixed IV for consistent encryption/decryption
    // In production, you might want to use a random IV and prepend it to the encrypted data
    const ivString = process.env.CRYPTO_IV || '1234567890123456'; // 16 characters
    this.iv = Buffer.from(ivString, 'utf8');

    if (this.iv.length !== 16) {
      throw new Error('CRYPTO_IV must be exactly 16 characters long');
    }
  }

  encrypt(value: string): string {
    try {
      const cipher = createCipheriv(this.algorithm as any, this.secretKey as any, this.iv as any);
      let encrypted = cipher.update(value, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Convert to base64 and make it URL-safe
      const base64 = Buffer.from(encrypted, 'hex').toString('base64');
      return this.makeUrlSafe(base64);
    } catch (error) {
      throw new BadRequestException('Failed to encrypt value');
    }
  }

  decrypt(encryptedValue: string): string {
    try {
      // Convert from URL-safe base64 back to regular base64
      const base64 = this.fromUrlSafe(encryptedValue);
      const encrypted = Buffer.from(base64, 'base64').toString('hex');

      const decipher = createDecipheriv(this.algorithm as any, this.secretKey as any, this.iv as any);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new BadRequestException('Failed to decrypt value - invalid or corrupted data');
    }
  }

  encryptNumber(number: number): string {
    if (!number || number <= 0) {
      throw new BadRequestException('Invalid number');
    }

    return this.encrypt(number.toString());
  }

  decryptNumber(encryptedNumber: string): number {
    if (!encryptedNumber) {
      throw new BadRequestException('Encrypted number is required');
    }

    const decryptedValue = this.decrypt(encryptedNumber);
    const number = parseInt(decryptedValue, 10);

    if (isNaN(number) || number <= 0) {
      throw new BadRequestException('Invalid encrypted number');
    }

    return number;
  }

  /**
   * Make base64 string URL-safe by replacing characters
   */
  private makeUrlSafe(base64: string): string {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  /**
   * Convert URL-safe base64 back to regular base64
   */
  private fromUrlSafe(urlSafeBase64: string): string {
    let base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }

    return base64;
  }
}
