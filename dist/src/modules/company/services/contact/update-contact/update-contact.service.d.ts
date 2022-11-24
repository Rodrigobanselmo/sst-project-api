import { UpdateContactDto } from '../../../dto/contact.dto';
import { ContactRepository } from '../../../repositories/implementations/ContactRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class UpdateContactsService {
    private readonly contactRepository;
    constructor(contactRepository: ContactRepository);
    execute(UpsertContactsDto: UpdateContactDto, user: UserPayloadDto): Promise<import("../../../entities/contact.entity").ContactEntity>;
}
