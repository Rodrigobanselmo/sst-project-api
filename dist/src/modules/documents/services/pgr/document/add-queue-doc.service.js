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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddQueueDocumentService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const RiskDocumentRepository_1 = require("../../../../sst/repositories/implementations/RiskDocumentRepository");
let AddQueueDocumentService = class AddQueueDocumentService {
    constructor(riskDocumentRepository) {
        this.riskDocumentRepository = riskDocumentRepository;
        this.sqs = new aws_sdk_1.default.SQS({ region: process.env.AWS_SQS_PGR_REGION });
        this.queueUrl = process.env.AWS_SQS_PGR_URL;
    }
    async execute(upsertPgrDto, userPayloadDto) {
        const companyId = userPayloadDto.targetCompanyId;
        const riskDoc = await this.riskDocumentRepository.upsert({
            id: upsertPgrDto.id,
            name: upsertPgrDto.name,
            riskGroupId: upsertPgrDto.riskGroupId,
            pcmsoId: upsertPgrDto.pcmsoId,
            version: upsertPgrDto.version,
            workspaceId: upsertPgrDto.workspaceId,
            workspaceName: upsertPgrDto.workspaceName,
            companyId,
            status: upsertPgrDto.status || client_1.StatusEnum.PROCESSING,
        });
        const payload = Object.assign(Object.assign({}, upsertPgrDto), { id: riskDoc.id });
        await this.sqs
            .sendMessage({
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify(payload),
            MessageGroupId: 'DOCUMENT',
            MessageDeduplicationId: riskDoc.id,
        })
            .promise();
        return riskDoc;
    }
};
AddQueueDocumentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskDocumentRepository_1.RiskDocumentRepository])
], AddQueueDocumentService);
exports.AddQueueDocumentService = AddQueueDocumentService;
//# sourceMappingURL=add-queue-doc.service.js.map