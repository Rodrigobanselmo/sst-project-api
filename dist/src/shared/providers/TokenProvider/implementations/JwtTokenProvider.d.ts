import { JwtService } from '@nestjs/jwt';
import { DayJSProvider } from '../../DateProvider/implementations/DayJSProvider';
import { IPayloadToken, ITokenProvider } from '../models/ITokenProvider.types';
export declare class JwtTokenProvider implements ITokenProvider {
    private readonly jwtService;
    private readonly dateProvider;
    constructor(jwtService: JwtService, dateProvider: DayJSProvider);
    generateToken(payload: IPayloadToken): string;
    generateRefreshToken(userId: number): [string, Date];
    verifyIsValidToken(refresh_token: string, secret_type?: 'refresh' | 'token'): number | 'expired' | 'invalid';
}
