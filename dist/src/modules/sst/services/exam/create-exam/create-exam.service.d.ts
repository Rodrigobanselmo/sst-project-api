import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateExamDto } from '../../../dto/exam.dto';
import { ExamRepository } from '../../../repositories/implementations/ExamRepository';
export declare class CreateExamService {
    private readonly examRepository;
    constructor(examRepository: ExamRepository);
    execute(createExamDto: CreateExamDto, user: UserPayloadDto): Promise<import("../../../entities/exam.entity").ExamEntity>;
}
