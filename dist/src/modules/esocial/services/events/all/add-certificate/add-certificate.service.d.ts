/// <reference types="multer" />
import { CompanyCertRepository } from './../../../../repositories/implementations/CompanyCertRepository';
import { AddCertDto } from './../../../../dto/add-cert.dto';
import { UserPayloadDto } from './../../../../../../shared/dto/user-payload.dto';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
export declare class AddCertificationESocialService {
    private readonly companyCertRepository;
    private readonly eSocialMethodsProvider;
    constructor(companyCertRepository: CompanyCertRepository, eSocialMethodsProvider: ESocialMethodsProvider);
    execute(file: Express.Multer.File, { password }: AddCertDto, user: UserPayloadDto): Promise<void>;
}
