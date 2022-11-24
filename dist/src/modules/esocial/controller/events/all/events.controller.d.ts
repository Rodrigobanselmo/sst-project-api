/// <reference types="multer" />
import { FetchESocialBatchEventsService } from './../../../services/events/all/fetch-batch-events/fetch-batch-events.service';
import { FindESocialBatchDto } from './../../../dto/esocial-batch.dto';
import { FindESocialEventService } from './../../../services/events/all/find-events/find-events.service';
import { FindESocialEventDto } from './../../../dto/esocial-event.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AddCertDto } from '../../../dto/add-cert.dto';
import { AddCertificationESocialService } from '../../../services/events/all/add-certificate/add-certificate.service';
import { SendBatchESocialService } from '../../../services/events/all/send-batch/send-batch.service';
import { FindESocialBatchService } from '../../../../../modules/esocial/services/events/all/find-batch/find-batch.service';
export declare class ESocialEventController {
    private readonly addCertificationESocialService;
    private readonly sendBatchESocialService;
    private readonly findESocialEventService;
    private readonly findESocialBatchService;
    private readonly fetchESocialBatchEventsService;
    constructor(addCertificationESocialService: AddCertificationESocialService, sendBatchESocialService: SendBatchESocialService, findESocialEventService: FindESocialEventService, findESocialBatchService: FindESocialBatchService, fetchESocialBatchEventsService: FetchESocialBatchEventsService);
    addCert(file: Express.Multer.File, user: UserPayloadDto, body: AddCertDto): Promise<void>;
    sendBatch(): Promise<{
        s: string;
    }>;
    fetch(): Promise<void>;
    findEvents(userPayloadDto: UserPayloadDto, query: FindESocialEventDto): Promise<{
        data: import("../../../entities/employeeEsocialEvent.entity").EmployeeESocialEventEntity[];
        count: number;
    }>;
    findBatch(userPayloadDto: UserPayloadDto, query: FindESocialBatchDto): Promise<{
        data: import("../../../entities/employeeEsocialBatch.entity").EmployeeESocialBatchEntity[];
        count: number;
    }>;
}
