import { FindActivityDto } from '../../../dto/activity.dto';
import { ActivityRepository } from './../../../repositories/implementations/ActivityRepository';
export declare class FindCnaeService {
    private readonly activityRepository;
    constructor(activityRepository: ActivityRepository);
    execute({ skip, take, ...query }: FindActivityDto): Promise<{
        data: import("../../../entities/activity.entity").ActivityEntity[];
        count: number;
    }>;
}
