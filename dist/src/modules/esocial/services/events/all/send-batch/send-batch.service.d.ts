import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { Client } from 'nestjs-soap';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
export declare class SendBatchESocialService {
    private readonly soupClient;
    private readonly eSocialEventProvider;
    private readonly eSocialMethodsProvider;
    constructor(soupClient: Client, eSocialEventProvider: ESocialEventProvider, eSocialMethodsProvider: ESocialMethodsProvider);
    execute(): Promise<{
        s: string;
    }>;
}
