import { Test, TestingModule } from '@nestjs/testing';
import { ShortenService } from './shorten.service';
import { ShortenRepository } from '../repositories/shorten.repository';

describe('ShortenService', () => {
  let service: ShortenService;
  let repository: ShortenRepository;

  const mockShortenRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortenService,
        {
          provide: ShortenRepository,
          useValue: mockShortenRepository,
        },
      ],
    }).compile();

    service = module.get<ShortenService>(ShortenService);
    repository = module.get<ShortenRepository>(ShortenRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
