import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindExamDto } from '../../../dto/exam.dto';
import { ExamRepository } from '../../../repositories/implementations/ExamRepository';
export declare class FindExamService {
    private readonly examRepository;
    constructor(examRepository: ExamRepository);
    execute({ skip, take, ...query }: FindExamDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/exam.entity").ExamEntity[];
        count: number;
    }>;
}
