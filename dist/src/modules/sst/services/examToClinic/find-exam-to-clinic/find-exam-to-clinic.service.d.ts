import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindExamToClinicDto } from '../../../dto/exam-to-clinic.dto';
import { ExamToClinicRepository } from '../../../repositories/implementations/ExamToClinicRepository';
export declare class FindExamToClinicService {
    private readonly examRepository;
    constructor(examRepository: ExamToClinicRepository);
    execute({ skip, take, ...query }: FindExamToClinicDto, user: UserPayloadDto): Promise<{
        data: import("../../../entities/examToClinic").ExamToClinicEntity[];
        count: number;
    }>;
}
