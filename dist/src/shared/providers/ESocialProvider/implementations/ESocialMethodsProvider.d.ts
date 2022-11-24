/// <reference types="node" />
import { CompanyRepository } from '../../../../modules/company/repositories/implementations/CompanyRepository';
import { DayJSProvider } from '../../DateProvider/implementations/DayJSProvider';
import { ICompanyOptions, IConvertPfx, IConvertPfxReturn, ICreateZipFolder, IESocialEventProvider, IIdOptions, ISignEvent } from '../models/IESocialMethodProvider';
declare class ESocialGenerateId {
    private cpfCnpj;
    private type;
    private index;
    constructor(cpfCnpj: string, options: IIdOptions);
    newId(): string;
}
declare class ESocialMethodsProvider implements IESocialEventProvider {
    private readonly companyRepository;
    private readonly dayJSProvider?;
    constructor(companyRepository: CompanyRepository, dayJSProvider?: DayJSProvider);
    signEvent({ cert: { certificate, key }, xml }: ISignEvent): string;
    checkSignature({ cert: { certificate }, xml: signXML }: ISignEvent): string;
    generateId(cpfCnpj: string, { type, seqNum, index }: IIdOptions): string[];
    classGenerateId(cpfCnpj: string, options?: IIdOptions): ESocialGenerateId;
    getCompany(companyId: string, options?: ICompanyOptions): Promise<{
        cert: import("../../../../modules/esocial/entities/companyCert.entity").CompanyCertEntity;
        company: import("../../../../modules/company/entities/company.entity").CompanyEntity;
    }>;
    createZipFolder({ company, eventsXml, type }: ICreateZipFolder): Promise<{
        zipFile: Buffer;
        fileName: string;
    }>;
    convertPfxToPem({ file, password }: IConvertPfx): Promise<IConvertPfxReturn>;
}
export { ESocialMethodsProvider };
