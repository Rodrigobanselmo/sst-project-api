export interface ITokenAdapter {
  generateToken(payload: ITokenAdapter.TokenPayload): string;
  generateRefreshToken(userId: number): [string, Date];
  verifyIsValidToken(refreshToken: string, type?: 'refresh' | 'token'): number | 'expired' | 'invalid';
}

export namespace ITokenAdapter {
  export interface TokenPayload {
    companyId: string;
    roles: string[];
    permissions: string[];
    sub: number;
    email: string;
  }
}
