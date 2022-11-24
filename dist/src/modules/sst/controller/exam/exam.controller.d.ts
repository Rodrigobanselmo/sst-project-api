import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateExamDto, FindExamDto, FindExamHierarchyDto, UpdateExamDto } from '../../dto/exam.dto';
import { CreateExamService } from '../../services/exam/create-exam/create-exam.service';
import { DeleteSoftExamService } from '../../services/exam/delete-soft-exam/delete-soft-exam.service';
import { UpdateExamService } from '../../services/exam/update-exam/update-exam.service';
import { FindExamService } from '../../services/exam/find-exam/find-exam.service';
import { FindExamByHierarchyService } from '../../services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
export declare class ExamController {
    private readonly createExamService;
    private readonly findExamService;
    private readonly updateExamService;
    private readonly deleteSoftExamService;
    private readonly findExamByHierarchyService;
    constructor(createExamService: CreateExamService, findExamService: FindExamService, updateExamService: UpdateExamService, deleteSoftExamService: DeleteSoftExamService, findExamByHierarchyService: FindExamByHierarchyService);
    create(userPayloadDto: UserPayloadDto, createExamDto: CreateExamDto): Promise<import("../../entities/exam.entity").ExamEntity>;
    findAllAvailable(userPayloadDto: UserPayloadDto, query: FindExamDto): Promise<{
        data: import("../../entities/exam.entity").ExamEntity[];
        count: number;
    }>;
    findByHierarchy(userPayloadDto: UserPayloadDto, query: FindExamHierarchyDto): Promise<{
        data: {
            exam: {
                id: string;
                name: string;
                isAttendance: boolean;
            };
            origins: import("../../entities/exam.entity").IExamOriginData[];
        }[];
    }>;
    update(id: number, userPayloadDto: UserPayloadDto, updateRiskDto: UpdateExamDto): Promise<import("../../entities/exam.entity").ExamEntity>;
    deleteSoft(id: number, userPayloadDto: UserPayloadDto): Promise<import("../../entities/exam.entity").ExamEntity>;
}
