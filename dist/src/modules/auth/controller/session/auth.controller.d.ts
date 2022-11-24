import { ForgotPasswordDto } from '../../dto/forgot-password';
import { LoginGoogleUserDto, LoginUserDto } from '../../dto/login-user.dto';
import { RefreshTokenDto } from '../../dto/refresh-token.dto';
import { DeleteAllExpiredService } from '../../services/session/delete-all-expired/delete-all-expired.service';
import { RefreshTokenService } from '../../services/session/refresh-token/refresh-token.service';
import { SendForgotPassMailService } from '../../services/session/send-forgot-pass-mail/send-forgot-pass-mail.service';
import { SessionService } from '../../services/session/session/session.service';
import { VerifyGoogleLoginService } from '../../services/session/verify-google-login/verify-google-login.service';
export declare class AuthController {
    private readonly sessionService;
    private readonly refreshTokenService;
    private readonly sendForgotPassMailService;
    private readonly deleteAllExpiredRefreshTokensService;
    private readonly verifyGoogleLoginService;
    constructor(sessionService: SessionService, refreshTokenService: RefreshTokenService, sendForgotPassMailService: SendForgotPassMailService, deleteAllExpiredRefreshTokensService: DeleteAllExpiredService, verifyGoogleLoginService: VerifyGoogleLoginService);
    session(loginUserDto: LoginUserDto): Promise<{
        companyId: string;
        permissions: string[];
        roles: string[];
        token: string;
        refresh_token: string;
        user: import("../../../users/entities/user.entity").UserEntity;
    }>;
    google(loginUserDto: LoginGoogleUserDto): Promise<{
        companyId: string;
        permissions: string[];
        roles: string[];
        token: string;
        refresh_token: string;
        user: import("../../../users/entities/user.entity").UserEntity;
    }>;
    refresh({ refresh_token, companyId }: RefreshTokenDto): Promise<{
        permissions: string[];
        roles: string[];
        companyId: string;
        refresh_token: string;
        token: string;
        user: import("../../../users/entities/user.entity").UserEntity;
    }>;
    forgot({ email }: ForgotPasswordDto): Promise<void>;
    deleteAll(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
