import { PrismaService } from '../../../../prisma/prisma.service';
declare class DocxProvider {
    private readonly prisma?;
    constructor(prisma?: PrismaService);
    create(): Promise<void>;
}
export { DocxProvider };
