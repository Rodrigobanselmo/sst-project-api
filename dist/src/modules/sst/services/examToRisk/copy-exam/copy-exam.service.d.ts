import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CopyExamsRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';
export declare class CopyExamRiskService {
    private readonly examRiskRepository;
    constructor(examRiskRepository: ExamRiskRepository);
    execute(copyExamsRiskDto: CopyExamsRiskDto, user: UserPayloadDto): Promise<void>;
}
