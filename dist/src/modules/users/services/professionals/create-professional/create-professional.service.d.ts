import { UsersRepository } from './../../../repositories/implementations/UsersRepository';
import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { CreateProfessionalDto } from './../../../dto/professional.dto';
import { ProfessionalRepository } from './../../../repositories/implementations/ProfessionalRepository';
import { SendGridProvider } from '../../../../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';
export declare class CreateProfessionalService {
    private readonly professionalRepository;
    private readonly userRepository;
    private readonly mailProvider;
    constructor(professionalRepository: ProfessionalRepository, userRepository: UsersRepository, mailProvider: SendGridProvider);
    execute({ ...createDataDto }: CreateProfessionalDto, user: UserPayloadDto): Promise<import("../../../entities/professional.entity").ProfessionalEntity>;
}
