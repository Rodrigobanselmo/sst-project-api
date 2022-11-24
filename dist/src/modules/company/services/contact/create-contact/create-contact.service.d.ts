import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateContactDto } from '../../../dto/contact.dto';
import { ContactRepository } from '../../../repositories/implementations/ContactRepository';
export declare class CreateContactsService {
    private readonly contactRepository;
    constructor(contactRepository: ContactRepository);
    execute(UpsertContactsDto: CreateContactDto, user: UserPayloadDto): Promise<import("../../../entities/contact.entity").ContactEntity>;
}
