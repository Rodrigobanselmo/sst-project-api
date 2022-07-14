import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { ActivityDto } from '../../dto/activity.dto';
import { ActivityEntity } from '../../entities/activity.entity';

let i = 0;

@Injectable()
export class ActivityRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const activities = await this.prisma.activity.findMany();
    if (!activities) return;
    return activities.map((activity) => new ActivityEntity(activity));
  }

  async upsertMany(activitiesDto: ActivityDto[]) {
    i++;
    console.log('batch' + i);
    const data = await this.prisma.$transaction(
      activitiesDto.map(({ code, ...activityDto }) =>
        this.prisma.activity.upsert({
          where: { code },
          create: {
            ...activityDto,
            code,
          },
          update: activityDto,
        }),
      ),
    );

    return data.map((activity) => new ActivityEntity(activity));
  }
}
