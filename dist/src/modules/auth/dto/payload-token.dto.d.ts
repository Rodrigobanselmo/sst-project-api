import { UserCompanyDto } from '../../../shared/dto/user-payload.dto';
export declare class PayloadTokenDto extends UserCompanyDto {
    readonly sub: number;
    readonly email: string;
}
