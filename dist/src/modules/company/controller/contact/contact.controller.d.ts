import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateContactDto, FindContactDto, UpdateContactDto } from '../../dto/contact.dto';
import { CreateContactsService } from '../../services/contact/create-contact/create-contact.service';
import { DeleteContactsService } from '../../services/contact/delete-contact/delete-contact.service';
import { FindContactsService } from '../../services/contact/find-contact/find-company-groups-group.service';
import { UpdateContactsService } from '../../services/contact/update-contact/update-contact.service';
export declare class ContactController {
    private readonly updateContactsService;
    private readonly createContactsService;
    private readonly findAvailableContactsService;
    private readonly deleteContactsService;
    constructor(updateContactsService: UpdateContactsService, createContactsService: CreateContactsService, findAvailableContactsService: FindContactsService, deleteContactsService: DeleteContactsService);
    find(userPayloadDto: UserPayloadDto, query: FindContactDto): Promise<{
        data: import("../../entities/contact.entity").ContactEntity[];
        count: number;
    }>;
    create(upsertAccessGroupDto: CreateContactDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/contact.entity").ContactEntity>;
    update(upsertAccessGroupDto: UpdateContactDto, userPayloadDto: UserPayloadDto, id: number): Promise<import("../../entities/contact.entity").ContactEntity>;
    delete(userPayloadDto: UserPayloadDto, id: number): Promise<import("../../entities/contact.entity").ContactEntity>;
}
