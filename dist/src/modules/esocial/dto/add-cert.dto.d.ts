export declare class AddCertDto {
    password: string;
    companyId: string;
}
export declare class UpsertAddCertDto {
    certificate: string;
    key: string;
    notAfter: Date;
    notBefore: Date;
    companyId: string;
}
