interface IPayload {
  sub: string;
  email: string;
}

interface IVerifyToken {
  token: string;
  secret_type: 'default' | 'refresh';
}

interface IPayloadToken {
  sub: number;
  email: string;
  roles: string[];
  permissions: string[];
}

interface ITokenProvider {
  generateToken(payload: IPayloadToken): string;
  generateRefreshToken(userId: number): [string, Date];
  // expiresRefreshTokenDays(): number;
  // verifyIsValidToken(data: IVerifyToken): IPayload;
}

export { ITokenProvider, IVerifyToken, IPayload, IPayloadToken };
