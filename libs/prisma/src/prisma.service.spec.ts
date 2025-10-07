import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'DATABASE_URL':
            return 'postgresql://test:test@localhost:5432/test_db';
          case 'NODE_ENV':
            return 'test';
          default:
            return undefined;
        }
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get database URL from config', () => {
    expect(configService.get).toHaveBeenCalledWith('DATABASE_URL');
  });

  it('should not allow cleaning database in production', async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'NODE_ENV') return 'production';
      return 'test-value';
    });

    await expect(service.cleanDatabase()).rejects.toThrow('Cannot clean database in production');
  });
});
