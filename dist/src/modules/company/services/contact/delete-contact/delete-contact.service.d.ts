import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ContactRepository } from '../../../repositories/implementations/ContactRepository';
export declare class DeleteContactsService {
    private readonly contactRepository;
    constructor(contactRepository: ContactRepository);
    execute(id: number, user: UserPayloadDto): Promise<import("../../../entities/contact.entity").ContactEntity>;
}
