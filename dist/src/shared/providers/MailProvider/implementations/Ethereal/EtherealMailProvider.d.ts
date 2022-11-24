import { IMailProvider, ISendMailData } from '../../models/IMailProvider';
declare class EtherealMailProvider implements IMailProvider {
    private client;
    constructor();
    sendMail({ path, subject, to, variables }: ISendMailData): Promise<any>;
}
export { EtherealMailProvider };
