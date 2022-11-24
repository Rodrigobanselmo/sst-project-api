export declare class UserCompanyDto {
    readonly companyId: string;
    readonly roles: string[];
    readonly permissions: string[];
}
export declare class UserPayloadDto extends UserCompanyDto {
    readonly userId: number;
    readonly email: string;
    isMaster: boolean;
    isSystem: boolean;
    targetCompanyId?: string;
}
