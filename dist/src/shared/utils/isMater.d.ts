import { UserPayloadDto } from '../dto/user-payload.dto';
export interface IMasterReturn {
    isMaster: boolean;
    companyId: string;
}
export declare const isMaster: (user: UserPayloadDto | undefined, companyId?: string | false) => {
    isMaster: boolean;
    companyId: string;
    targetCompanyId: string;
};
