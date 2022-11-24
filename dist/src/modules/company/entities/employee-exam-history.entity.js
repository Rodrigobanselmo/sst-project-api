"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeExamsHistoryEntity = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const professional_entity_1 = require("../../../modules/users/entities/professional.entity");
const company_entity_1 = require("./company.entity");
const employee_entity_1 = require("./employee.entity");
const hierarchy_entity_1 = require("./hierarchy.entity");
const dayjs_1 = __importDefault(require("dayjs"));
class EmployeeExamsHistoryEntity {
    constructor(partial) {
        Object.assign(this, partial);
        if (this.clinic) {
            this.clinic = new company_entity_1.CompanyEntity(this.clinic);
        }
        if (this.employee) {
            this.employee = new employee_entity_1.EmployeeEntity(this.employee);
        }
        if (this.doctor) {
            this.doctor = new professional_entity_1.ProfessionalEntity(this.doctor);
        }
        if ([client_1.StatusEnum.PENDING, client_1.StatusEnum.PROCESSING].includes(this.status) && (0, dayjs_1.default)(this.doneDate).isBefore((0, dayjs_1.default)().add(-1, 'day')))
            this.status = client_1.StatusEnum.EXPIRED;
        if (this.hierarchy)
            this.hierarchy = new hierarchy_entity_1.HierarchyEntity(this.hierarchy);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, expiredDate: { required: true, type: () => Date }, doneDate: { required: true, type: () => Date }, validityInMonths: { required: true, type: () => Number }, time: { required: true, type: () => String }, obs: { required: true, type: () => String }, fileUrl: { required: true, type: () => String }, examType: { required: true, type: () => Object }, evaluationType: { required: true, type: () => Object }, conclusion: { required: true, type: () => Object }, status: { required: true, type: () => Object }, doctorId: { required: true, type: () => Number }, doctor: { required: true, type: () => require("../../users/entities/professional.entity").ProfessionalEntity }, clinicId: { required: true, type: () => String }, clinic: { required: true, type: () => require("./company.entity").CompanyEntity }, examId: { required: true, type: () => Number }, employeeId: { required: true, type: () => Number }, employee: { required: true, type: () => require("./employee.entity").EmployeeEntity }, exam: { required: false, type: () => require("../../sst/entities/exam.entity").ExamEntity }, userScheduleId: { required: true, type: () => Number }, userSchedule: { required: false, type: () => require("../../users/entities/user.entity").UserEntity }, userDoneId: { required: true, type: () => Number }, userDone: { required: false, type: () => require("../../users/entities/user.entity").UserEntity }, clinicObs: { required: true, type: () => String }, scheduleType: { required: true, type: () => Object }, changeHierarchyDate: { required: true, type: () => Date }, changeHierarchyAnyway: { required: true, type: () => Boolean }, hierarchyId: { required: true, type: () => String }, subOfficeId: { required: true, type: () => String }, hierarchy: { required: false, type: () => require("./hierarchy.entity").HierarchyEntity }, subOffice: { required: false, type: () => require("./hierarchy.entity").HierarchyEntity }, deletedAt: { required: true, type: () => Date }, isSequential: { required: true, type: () => Boolean }, sendEvent: { required: true, type: () => Boolean }, events: { required: true, type: () => [require("../../esocial/entities/employeeEsocialEvent.entity").EmployeeESocialEventEntity] }, asoExamId: { required: true, type: () => Number }, asoExam: { required: false, type: () => require("./employee-exam-history.entity").EmployeeExamsHistoryEntity }, complementaryExams: { required: false, type: () => [require("./employee-exam-history.entity").EmployeeExamsHistoryEntity] } };
    }
}
exports.EmployeeExamsHistoryEntity = EmployeeExamsHistoryEntity;
//# sourceMappingURL=employee-exam-history.entity.js.map