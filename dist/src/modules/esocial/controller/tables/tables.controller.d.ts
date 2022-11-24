import { FindAllTable27Service } from '../../services/tables/find-all-27.service';
export declare class TablesController {
    private readonly findAllTable27Service;
    constructor(findAllTable27Service: FindAllTable27Service);
    find(): Promise<{
        code: string;
        'name ': string;
    }[]>;
}
