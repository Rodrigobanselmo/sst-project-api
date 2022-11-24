import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateExamDto } from '../../../dto/exam.dto';
import { ExamRepository } from '../../../repositories/implementations/ExamRepository';
export declare class UpdateExamService {
    private readonly examRepository;
    constructor(examRepository: ExamRepository);
    execute(id: number, updateExamDto: UpdateExamDto, user: UserPayloadDto): Promise<import("../../../entities/exam.entity").ExamEntity>;
}
