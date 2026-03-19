import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ShortenService } from './shorten.service';
import { ShortenRepository } from '../repositories/shorten.repository';

describe('ShortenService', () => {
  let service: ShortenService;
  let repository: ShortenRepository;

  const mockShort = {
    id: '1',
    url: 'https://example.com',
    shortCode: 'abc123',
    createdAt: new Date(),
    updatedAt: new Date(),
    accessCount: 0,
  };

  const mockShortWithoutAccessCount = {
    id: '1',
    url: 'https://example.com',
    shortCode: 'abc123',
    createdAt: mockShort.createdAt,
    updatedAt: mockShort.updatedAt,
  };

  const mockShortenRepository = {
    findOne: jest.fn(),
    findOneAndIncrementAccess: jest.fn(),
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

  describe('create', () => {
    it('should create a short without accessCount', async () => {
      mockShortenRepository.create.mockResolvedValue(mockShort);
      const result = await service.create({ url: 'https://example.com' });
      expect(result).toEqual(mockShortWithoutAccessCount);
      expect(result).not.toHaveProperty('accessCount');
      expect(mockShortenRepository.create).toHaveBeenCalledWith({
        url: 'https://example.com',
      });
    });
  });

  describe('getById', () => {
    it('should return the short without accessCount', async () => {
      mockShortenRepository.findOneAndIncrementAccess.mockResolvedValue(
        mockShort,
      );
      const result = await service.getById('1');
      expect(result).toEqual(mockShortWithoutAccessCount);
      expect(result).not.toHaveProperty('accessCount');
      expect(
        mockShortenRepository.findOneAndIncrementAccess,
      ).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if not found', async () => {
      mockShortenRepository.findOneAndIncrementAccess.mockResolvedValue(null);
      await expect(service.getById('99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update the short without accessCount', async () => {
      mockShortenRepository.update.mockResolvedValue(mockShort);
      const result = await service.update('1', { url: 'https://updated.com' });
      expect(result).toEqual(mockShortWithoutAccessCount);
      expect(result).not.toHaveProperty('accessCount');
    });

    it('should throw NotFoundException if not found', async () => {
      mockShortenRepository.update.mockResolvedValue(null);
      await expect(
        service.update('99', { url: 'https://updated.com' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete the short', async () => {
      mockShortenRepository.remove.mockResolvedValue(true);
      await expect(service.delete('1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if not found', async () => {
      mockShortenRepository.remove.mockResolvedValue(false);
      await expect(service.delete('99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStatsById', () => {
    it('should return stats for the short', async () => {
      mockShortenRepository.findOne.mockResolvedValue(mockShort);
      const result = await service.getStatsById('1');
      expect(result).toEqual(mockShort);
    });

    it('should throw NotFoundException if not found', async () => {
      mockShortenRepository.findOne.mockResolvedValue(null);
      await expect(service.getStatsById('99')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
