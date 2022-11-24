import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CopyExamsRiskDto, CreateExamsRiskDto, FindExamRiskDto, UpdateExamRiskDto } from '../../dto/exam-risk.dto';
import { CopyExamRiskService } from '../../services/examToRisk/copy-exam/copy-exam.service';
import { CreateExamRiskService } from '../../services/examToRisk/create-exam/create-exam.service';
import { FindExamRiskService } from '../../services/examToRisk/find-exam/find-exam.service';
import { UpdateExamRiskService } from '../../services/examToRisk/update-exam/update-exam.service';
export declare class ExamRiskController {
    private readonly createExamService;
    private readonly findExamService;
    private readonly updateExamService;
    private readonly copyExamRiskService;
    constructor(createExamService: CreateExamRiskService, findExamService: FindExamRiskService, updateExamService: UpdateExamRiskService, copyExamRiskService: CopyExamRiskService);
    create(userPayloadDto: UserPayloadDto, createExamDto: CreateExamsRiskDto): Promise<import("../../entities/examRisk.entity").ExamRiskEntity>;
    copy(userPayloadDto: UserPayloadDto, createExamDto: CopyExamsRiskDto): Promise<void>;
    update(id: number, userPayloadDto: UserPayloadDto, updateRiskDto: UpdateExamRiskDto): Promise<import("../../entities/examRisk.entity").ExamRiskEntity>;
    findAllAvailable(userPayloadDto: UserPayloadDto, query: FindExamRiskDto): Promise<{
        data: import("../../entities/examRisk.entity").ExamRiskEntity[];
        count: number;
    }>;
}
