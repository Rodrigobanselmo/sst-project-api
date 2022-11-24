import { UserPayloadDto } from '../dto/user-payload.dto';
export interface IMasterReturn {
    isSystem: boolean;
    companyId: string;
    targetCompanyId: string;
}
export declare const isMaster: (user: UserPayloadDto | undefined, companyId?: string | false) => {
    isMaster: boolean;
    isSystem: boolean;
    companyId: string;
    targetCompanyId: string;
};
