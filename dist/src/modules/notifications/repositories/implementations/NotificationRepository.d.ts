import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationEntity } from '../../entities/notification.entity';
import { CreateNotificationDto, FindNotificationDto, UpdateNotificationDto, UpdateUserNotificationDto } from '../../dto/nofication.dto';
export declare class NotificationRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ companiesIds, usersIds, json, ...createNotificationDto }: CreateNotificationDto & {
        system?: boolean;
        companyId: string;
    }): Promise<NotificationEntity>;
    update({ id, companiesIds, usersIds, json, ...createNotificationDto }: UpdateNotificationDto): Promise<NotificationEntity>;
    confirm({ userId, id }: UpdateUserNotificationDto): Promise<NotificationEntity>;
    confirmMany({ userId, ids }: UpdateUserNotificationDto): Promise<NotificationEntity[]>;
    find(query: Partial<FindNotificationDto> & {
        userId: number;
    }, pagination: PaginationQueryDto, options?: Prisma.NotificationFindManyArgs): Promise<{
        data: NotificationEntity[];
        countUnread: number;
        count: number;
    }>;
    findCountNude(options?: Prisma.NotificationFindManyArgs): Promise<{
        data: NotificationEntity[];
        count: number;
    }>;
    findNude(options?: Prisma.NotificationFindManyArgs): Promise<NotificationEntity[]>;
    findFirstNude(options?: Prisma.NotificationFindFirstArgs): Promise<NotificationEntity>;
}
