import { FindContactDto } from './../../../dto/contact.dto';
import { ContactRepository } from '../../../repositories/implementations/ContactRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class FindContactsService {
    private readonly contactRepository;
    constructor(contactRepository: ContactRepository);
    execute({ skip, take, ...query }: FindContactDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/contact.entity").ContactEntity[];
        count: number;
    }>;
}
