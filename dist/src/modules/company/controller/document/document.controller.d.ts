/// <reference types="multer" />
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateDocumentDto, FindDocumentDto, UpdateDocumentDto } from '../../dto/document.dto';
import { CreateDocumentService } from '../../services/document/create-document/create-document.service';
import { DeleteDocumentService } from '../../services/document/delete-document/delete-document.service';
import { DownloadDocumentService } from '../../services/document/download-document/download-document.service';
import { FindByIdDocumentService } from '../../services/document/find-by-id-document/find-by-id-document.service';
import { FindDocumentService } from '../../services/document/find-document/find-document.service';
import { UpdateDocumentService } from '../../services/document/update-document/update-document.service';
export declare class DocumentController {
    private readonly updateDocumentService;
    private readonly createDocumentService;
    private readonly findDocumentService;
    private readonly findByIdDocumentService;
    private readonly deleteDocumentService;
    private readonly downloadDocumentService;
    constructor(updateDocumentService: UpdateDocumentService, createDocumentService: CreateDocumentService, findDocumentService: FindDocumentService, findByIdDocumentService: FindByIdDocumentService, deleteDocumentService: DeleteDocumentService, downloadDocumentService: DownloadDocumentService);
    find(userPayloadDto: UserPayloadDto, query: FindDocumentDto): Promise<{
        data: import("../../entities/document.entity").DocumentEntity[];
        count: number;
    }>;
    findById(userPayloadDto: UserPayloadDto, id: number): Promise<import("../../entities/document.entity").DocumentEntity>;
    download(res: any, userPayloadDto: UserPayloadDto, id: number): Promise<void>;
    create(file: Express.Multer.File, createDto: CreateDocumentDto, userPayloadDto: UserPayloadDto): Promise<import("../../entities/document.entity").DocumentEntity>;
    update(file: Express.Multer.File, update: UpdateDocumentDto, userPayloadDto: UserPayloadDto, id: number): Promise<import("../../entities/document.entity").DocumentEntity>;
    delete(userPayloadDto: UserPayloadDto, id: number): Promise<import("../../entities/document.entity").DocumentEntity>;
}
