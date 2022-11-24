import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateProfessionalDto } from '../../../dto/professional.dto';
import { ProfessionalRepository } from '../../../repositories/implementations/ProfessionalRepository';
import { SendGridProvider } from './../../../../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';
export declare class UpdateProfessionalService {
    private readonly mailProvider;
    private readonly professionalRepository;
    constructor(mailProvider: SendGridProvider, professionalRepository: ProfessionalRepository);
    execute({ ...updateDataDto }: UpdateProfessionalDto, user: UserPayloadDto): Promise<import("../../../entities/professional.entity").ProfessionalEntity>;
}
