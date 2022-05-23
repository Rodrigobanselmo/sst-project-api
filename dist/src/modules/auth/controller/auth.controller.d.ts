import { ForgotPasswordDto } from '../dto/forgot-password';
import { LoginUserDto } from '../dto/login-user.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { DeleteAllExpiredService } from '../services/delete-all-expired/delete-all-expired.service';
import { RefreshTokenService } from '../services/refresh-token/refresh-token.service';
import { SendForgotPassMailService } from '../services/send-forgot-pass-mail/send-forgot-pass-mail.service';
import { SessionService } from '../services/session/session.service';
export declare class AuthController {
    private readonly sessionService;
    private readonly refreshTokenService;
    private readonly sendForgotPassMailService;
    private readonly deleteAllExpiredRefreshTokensService;
    constructor(sessionService: SessionService, refreshTokenService: RefreshTokenService, sendForgotPassMailService: SendForgotPassMailService, deleteAllExpiredRefreshTokensService: DeleteAllExpiredService);
    session(loginUserDto: LoginUserDto): Promise<{
        companyId: string;
        permissions: string[];
        roles: string[];
        token: string;
        refresh_token: string;
        user: import("../../users/entities/user.entity").UserEntity;
    }>;
    refresh({ refresh_token }: RefreshTokenDto): Promise<{
        companyId: string;
        permissions: string[];
        roles: string[];
        refresh_token: string;
        token: string;
        user: import("../../users/entities/user.entity").UserEntity;
    }>;
    forgot({ email }: ForgotPasswordDto): Promise<void>;
    deleteAll(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
