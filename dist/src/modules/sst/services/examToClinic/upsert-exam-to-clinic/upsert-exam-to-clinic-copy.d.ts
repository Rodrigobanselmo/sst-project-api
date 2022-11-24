import { ExamToClinicRepository } from '../../../repositories/implementations/ExamToClinicRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpsertExamToClinicDto } from '../../../dto/exam-to-clinic.dto';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
export declare class UpsertExamToClinicService {
    private readonly examToClinicRepository;
    private readonly dayjs;
    constructor(examToClinicRepository: ExamToClinicRepository, dayjs: DayJSProvider);
    execute(createExamDto: UpsertExamToClinicDto, user: UserPayloadDto): Promise<import("../../../entities/examToClinic").ExamToClinicEntity>;
}
