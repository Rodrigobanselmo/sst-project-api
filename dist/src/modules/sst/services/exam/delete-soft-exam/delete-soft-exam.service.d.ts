import { ExamEntity } from '../../../entities/exam.entity';
import { ExamRepository } from '../../../repositories/implementations/ExamRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
export declare class DeleteSoftExamService {
    private readonly examRepository;
    constructor(examRepository: ExamRepository);
    execute(id: number, userPayloadDto: UserPayloadDto): Promise<ExamEntity>;
}
