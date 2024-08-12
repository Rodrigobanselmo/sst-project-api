export interface JWTType {
  exp: number;
  iat: number;
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
}
