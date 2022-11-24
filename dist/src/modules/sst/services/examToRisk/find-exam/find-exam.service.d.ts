import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindExamRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';
export declare class FindExamRiskService {
    private readonly examRiskRepository;
    constructor(examRiskRepository: ExamRiskRepository);
    execute({ skip, take, ...query }: FindExamRiskDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/examRisk.entity").ExamRiskEntity[];
        count: number;
    }>;
}
