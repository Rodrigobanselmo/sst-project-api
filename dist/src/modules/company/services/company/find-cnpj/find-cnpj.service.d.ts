import { ICnpjResponse } from 'src/modules/company/interfaces/cnpj';
export declare class FindCnpjService {
    execute(cnpj: string): Promise<ICnpjResponse>;
}
