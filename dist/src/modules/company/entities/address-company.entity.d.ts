import { AddressCompany } from '.prisma/client';
import { UfStateEnum } from '@prisma/client';
export declare class AddressCompanyEntity implements AddressCompany {
    id: string;
    number: string;
    cep: string;
    street: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    companyId: string;
    uf: UfStateEnum;
    constructor(partial: Partial<AddressCompanyEntity>);
}
