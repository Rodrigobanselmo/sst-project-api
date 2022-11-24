import { Cache } from 'cache-manager';
import { FetchESocialBatchEventsService } from '../../services/events/all/fetch-batch-events/fetch-batch-events.service';
export declare class EsocialFetchBatchCron {
    private cacheManager;
    private readonly fetchESocialBatchEventsService;
    private index;
    constructor(cacheManager: Cache, fetchESocialBatchEventsService: FetchESocialBatchEventsService);
    handleCron(): Promise<void>;
}
