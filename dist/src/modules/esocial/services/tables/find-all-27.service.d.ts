import { ESocial27TableRepository } from '../../repositories/implementations/ESocial27TableRepository';
export declare class FindAllTable27Service {
    private readonly eSocial27TableRepository;
    constructor(eSocial27TableRepository: ESocial27TableRepository);
    execute(): Promise<{
        code: string;
        'name ': string;
    }[]>;
}
