/// <reference types="multer" />
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateEmployeeExamHistoryDto, FindClinicEmployeeExamHistoryDto, FindCompanyEmployeeExamHistoryDto, FindEmployeeExamHistoryDto, UpdateEmployeeExamHistoryDto, UpdateFileExamDto, UpdateManyScheduleExamDto } from '../../dto/employee-exam-history';
import { CreateEmployeeExamHistoryService } from '../../services/employee/0-history/exams/create/create.service';
import { DeleteExamFileService } from '../../services/employee/0-history/exams/delete-exam-file/delete-exam-file.service';
import { DeleteEmployeeExamHistoryService } from '../../services/employee/0-history/exams/delete/delete.service';
import { DownloadExamService } from '../../services/employee/0-history/exams/download-exam/download-exam.service';
import { FindByIdEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find-by-id/find-by-id.service';
import { FindClinicScheduleEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find-clinic-schedules/find-clinic-schedules.service';
import { FindCompanyScheduleEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find-company-schedules/find-company-schedules.service';
import { FindScheduleEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find-schedule/find-schedule.service';
import { FindEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find/find.service';
import { UpdateManyScheduleExamHistoryService } from '../../services/employee/0-history/exams/update-many/update-many.service';
import { UpdateEmployeeExamHistoryService } from '../../services/employee/0-history/exams/update/update.service';
import { UploadExamFileService } from '../../services/employee/0-history/exams/upload-exam-file/upload-exam-file.service';
export declare class EmployeeExamHistoryController {
    private readonly createEmployeeExamHistoryService;
    private readonly updateEmployeeExamHistoryService;
    private readonly findEmployeeExamHistoryService;
    private readonly findAskEmployeeExamHistoryService;
    private readonly findClinicScheduleEmployeeExamHistoryService;
    private readonly findCompanyScheduleEmployeeExamHistoryService;
    private readonly findByIdEmployeeExamHistoryService;
    private readonly deleteEmployeeExamHistoryService;
    private readonly updateManyScheduleExamHistoryService;
    private readonly downloadExamService;
    private readonly uploadExamFileService;
    private readonly deleteExamFileService;
    constructor(createEmployeeExamHistoryService: CreateEmployeeExamHistoryService, updateEmployeeExamHistoryService: UpdateEmployeeExamHistoryService, findEmployeeExamHistoryService: FindEmployeeExamHistoryService, findAskEmployeeExamHistoryService: FindScheduleEmployeeExamHistoryService, findClinicScheduleEmployeeExamHistoryService: FindClinicScheduleEmployeeExamHistoryService, findCompanyScheduleEmployeeExamHistoryService: FindCompanyScheduleEmployeeExamHistoryService, findByIdEmployeeExamHistoryService: FindByIdEmployeeExamHistoryService, deleteEmployeeExamHistoryService: DeleteEmployeeExamHistoryService, updateManyScheduleExamHistoryService: UpdateManyScheduleExamHistoryService, downloadExamService: DownloadExamService, uploadExamFileService: UploadExamFileService, deleteExamFileService: DeleteExamFileService);
    find(userPayloadDto: UserPayloadDto, query: FindEmployeeExamHistoryDto): Promise<{
        data: import("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity[];
        count: number;
    }>;
    findSchedule(userPayloadDto: UserPayloadDto, query: FindEmployeeExamHistoryDto): Promise<{
        data: import("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity[];
        count: number;
    }>;
    findCompanySchedule(userPayloadDto: UserPayloadDto, query: FindCompanyEmployeeExamHistoryDto): Promise<{
        data: import("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity[];
        count: number;
    }>;
    findClinicSchedule(userPayloadDto: UserPayloadDto, query: FindClinicEmployeeExamHistoryDto): Promise<import("../../entities/employee.entity").EmployeeEntity[]>;
    findById(userPayloadDto: UserPayloadDto, id: number): Promise<import("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity>;
    create(upsertAccessGroupDto: CreateEmployeeExamHistoryDto, userPayloadDto: UserPayloadDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    createSchedule(upsertAccessGroupDto: CreateEmployeeExamHistoryDto, userPayloadDto: UserPayloadDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateSchedule(upsertAccessGroupDto: UpdateManyScheduleExamDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity[]>;
    update(upsertAccessGroupDto: UpdateEmployeeExamHistoryDto, userPayloadDto: UserPayloadDto, id: number): Promise<import("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity>;
    delete(userPayloadDto: UserPayloadDto, id: number, employeeId: number): Promise<import("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity>;
    download(res: any, userPayloadDto: UserPayloadDto, id: number): Promise<void>;
    upload(file: Express.Multer.File, createDto: UpdateFileExamDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity[]>;
    deleteFile(userPayloadDto: UserPayloadDto, id: number): Promise<import("../../entities/employee-exam-history.entity").EmployeeExamsHistoryEntity>;
}
