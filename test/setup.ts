import { PrismaService } from "@app/prisma"
import { Test } from "@nestjs/testing"


export const setupTestDatabase = async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [PrismaService],
    }).compile();

    const prismaService = moduleRef.get(PrismaService);
    await prismaService.cleanDatabase();

    return prismaService;
}

export const teardownTestDatabase = async (prismaService: PrismaService) => {
    await prismaService.cleanDatabase();
    await prismaService.$disconnect();
}