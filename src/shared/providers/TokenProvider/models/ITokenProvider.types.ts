interface IPayload {
  sub: string;
  email: string;
}

interface IVerifyToken {
  token: string;
  secret_type: 'default' | 'refresh';
}

interface IPayloadUserCompany {
  companyId: string;
  roles: string[];
  permissions: string[];
}

interface IPayloadToken {
  sub: number;
  email: string;
  companies: IPayloadUserCompany[];
}

interface ITokenProvider {
  generateToken(payload: IPayloadToken): string;
  generateRefreshToken(userId: number): [string, Date];
  // expiresRefreshTokenDays(): number;
  // verifyIsValidToken(data: IVerifyToken): IPayload;
}

export { ITokenProvider, IVerifyToken, IPayload, IPayloadToken };
