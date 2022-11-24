import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CopyExamsToClinicDto, FindExamToClinicDto, UpsertExamToClinicDto } from '../../dto/exam-to-clinic.dto';
import { CopyExamToClinicService } from '../../services/examToClinic/copy-exam-to-clinic/copy-exam-to-clinic.service';
import { FindExamToClinicService } from '../../services/examToClinic/find-exam-to-clinic/find-exam-to-clinic.service';
import { UpsertExamToClinicService } from '../../services/examToClinic/upsert-exam-to-clinic/upsert-exam-to-clinic.service';
export declare class ExamToClinicController {
    private readonly upsertExamToClinicService;
    private readonly findExamToClinicService;
    private readonly copyExamToClinicService;
    constructor(upsertExamToClinicService: UpsertExamToClinicService, findExamToClinicService: FindExamToClinicService, copyExamToClinicService: CopyExamToClinicService);
    create(userPayloadDto: UserPayloadDto, upsertDataDto: UpsertExamToClinicDto): Promise<import("../../entities/examToClinic").ExamToClinicEntity>;
    copy(userPayloadDto: UserPayloadDto, createExamDto: CopyExamsToClinicDto): Promise<void>;
    findAllAvailable(userPayloadDto: UserPayloadDto, query: FindExamToClinicDto): Promise<{
        data: import("../../entities/examToClinic").ExamToClinicEntity[];
        count: number;
    }>;
}
