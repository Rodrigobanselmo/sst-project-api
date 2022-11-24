import { IMailProvider, ISendMailData } from '../../models/IMailProvider';
declare class AwsSesProvider implements IMailProvider {
    private client;
    constructor();
    sendMail({ path, subject, to, variables, source }: ISendMailData): Promise<any>;
}
export { AwsSesProvider };
