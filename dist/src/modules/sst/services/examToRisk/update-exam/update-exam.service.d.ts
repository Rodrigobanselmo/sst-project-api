import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateExamRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';
export declare class UpdateExamRiskService {
    private readonly examRiskRepository;
    constructor(examRiskRepository: ExamRiskRepository);
    execute(id: number, updateExamDto: UpdateExamRiskDto, user: UserPayloadDto): Promise<import("../../../entities/examRisk.entity").ExamRiskEntity>;
}
