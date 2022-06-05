import { UserPayloadDto } from '../../dto/user-payload.dto';
export declare const checkIsAvailable: (data: {
    id: string | number;
    system: boolean;
    companyId: string;
}, user: UserPayloadDto, dataType: string) => boolean;
