import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateExamsRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';
export declare class CreateExamRiskService {
    private readonly examRiskRepository;
    constructor(examRiskRepository: ExamRiskRepository);
    execute(createExamDto: CreateExamsRiskDto, user: UserPayloadDto): Promise<import("../../../entities/examRisk.entity").ExamRiskEntity>;
}
