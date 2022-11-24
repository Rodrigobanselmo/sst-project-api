import { ICepResponse } from '../../../../../modules/company/interfaces/cep.types';
export declare class FindCepService {
    execute(cep: string): Promise<ICepResponse>;
}
