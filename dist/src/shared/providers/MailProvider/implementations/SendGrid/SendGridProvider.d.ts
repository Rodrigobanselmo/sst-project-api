import { IMailProvider, ISendMailData } from '../../models/IMailProvider';
declare class SendGridProvider implements IMailProvider {
    private client;
    constructor();
    sendMail({ path, subject, to, variables, source, }: ISendMailData): Promise<any>;
}
export { SendGridProvider };
