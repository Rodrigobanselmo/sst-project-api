import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateEpiDto, FindEpiDto, UpdateEpiDto, UpsertEpiDto } from '../../dto/epi.dto';
import { EpiEntity } from '../../entities/epi.entity';
export declare class EpiRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(createEpiDto: CreateEpiDto): Promise<EpiEntity>;
    update({ id, ...createEpiDto }: UpdateEpiDto & {
        id: number;
    }): Promise<EpiEntity>;
    upsertMany(upsertDtoMany: UpsertEpiDto[]): Promise<EpiEntity[]>;
    findByCA(ca: string): Promise<EpiEntity>;
    find(query: Partial<FindEpiDto>, pagination: PaginationQueryDto): Promise<{
        data: EpiEntity[];
        count: number;
    }>;
    findAll(): Promise<EpiEntity[]>;
}
