import { Injectable } from '@nestjs/common';

import { FindActivityDto } from '../../../dto/activity.dto';
import { ActivityRepository } from './../../../repositories/implementations/ActivityRepository';

@Injectable()
export class FindCnaeService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async execute({ skip, take, ...query }: FindActivityDto) {
    const access = await this.activityRepository.find(
      { ...query },
      { skip, take },
    );

    return access;
  }
}
