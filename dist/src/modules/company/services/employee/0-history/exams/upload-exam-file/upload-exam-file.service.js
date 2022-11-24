"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadExamFileService = void 0;
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../../../shared/constants/enum/errorMessage");
const AmazonStorageProvider_1 = require("../../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const EmployeeExamsHistoryRepository_1 = require("../../../../../repositories/implementations/EmployeeExamsHistoryRepository");
const uuid_1 = require("uuid");
const removeDuplicate_1 = require("../../../../../../../shared/utils/removeDuplicate");
let UploadExamFileService = class UploadExamFileService {
    constructor(employeeExamHistoryRepository, amazonStorageProvider) {
        this.employeeExamHistoryRepository = employeeExamHistoryRepository;
        this.amazonStorageProvider = amazonStorageProvider;
    }
    async execute({ ids }, user, file) {
        const companyId = user.targetCompanyId;
        const found = await this.employeeExamHistoryRepository.findNude({
            where: {
                id: { in: ids },
                employee: { companyId },
            },
            select: { id: true, fileUrl: true },
        });
        if (found.length != ids.length)
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_HISTORY_NOT_FOUND);
        let url;
        if (file) {
            url = await this.upload(companyId, file, found);
        }
        const document = await this.employeeExamHistoryRepository.updateMany({
            data: ids.map((id) => ({
                id,
                fileUrl: url,
            })),
        });
        return document;
    }
    async upload(companyId, file, examFound) {
        const fileUrls = (0, removeDuplicate_1.removeDuplicate)(examFound.map((exam) => exam.fileUrl).filter((i) => i), { removeById: 'fileUrl' });
        const foundByFileUrl = await this.employeeExamHistoryRepository.findNude({
            where: {
                fileUrl: {
                    in: fileUrls,
                },
            },
            select: {
                id: true,
                fileUrl: true,
            },
        });
        try {
            await Promise.all(fileUrls.map(async (fileUrl) => {
                const files = foundByFileUrl.filter((fileExam) => fileExam.fileUrl === fileUrl);
                if (files.length === 1) {
                    const splitUrl = fileUrl.split('.com/');
                    await this.amazonStorageProvider.delete({
                        fileName: splitUrl[splitUrl.length - 1],
                    });
                }
            }));
            const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
            const path = companyId + '/exams/' + `${(0, uuid_1.v4)()}` + '.' + fileType;
            const { url } = await this.amazonStorageProvider.upload({
                file: file.buffer,
                fileName: path,
            });
            return url;
        }
        catch (err) {
            console.log('upload exam file', err);
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.EMPLOYEE_HISTORY_NOT_FOUND);
        }
    }
};
UploadExamFileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository, AmazonStorageProvider_1.AmazonStorageProvider])
], UploadExamFileService);
exports.UploadExamFileService = UploadExamFileService;
//# sourceMappingURL=upload-exam-file.service.js.map