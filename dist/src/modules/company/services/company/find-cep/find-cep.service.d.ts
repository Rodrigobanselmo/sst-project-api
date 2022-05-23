import { ICepResponse } from 'src/modules/company/interfaces/cep.types';
export declare class FindCepService {
    execute(cep: string): Promise<ICepResponse>;
}
