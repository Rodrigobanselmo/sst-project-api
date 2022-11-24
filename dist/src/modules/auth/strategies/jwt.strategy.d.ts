import { Strategy } from 'passport-jwt';
interface ITokenPayload {
    exp: number;
    iat: number;
    sub: string;
    email: string;
    roles: string[];
    permissions: string[];
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate({ exp, iat, sub, ...rest }: ITokenPayload): Promise<{
        email: string;
        roles: string[];
        permissions: string[];
        userId: string;
    }>;
}
export {};
