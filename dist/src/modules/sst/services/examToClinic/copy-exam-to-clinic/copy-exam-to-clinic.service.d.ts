import { CopyExamsToClinicDto } from '../../../dto/exam-to-clinic.dto';
import { ExamToClinicRepository } from '../../../repositories/implementations/ExamToClinicRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class CopyExamToClinicService {
    private readonly examRepository;
    constructor(examRepository: ExamToClinicRepository);
    execute(copyExamsDto: CopyExamsToClinicDto, user: UserPayloadDto): Promise<void>;
}
