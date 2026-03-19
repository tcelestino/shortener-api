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

  describe('create', () => {
    it('deve criar um short com url valida', async () => {
      mockShortenRepository.create.mockResolvedValue(mockShort);
      const result = await service.create({ url: 'https://example.com' });
      expect(result).toEqual(mockShort);
      expect(mockShortenRepository.create).toHaveBeenCalledWith({ url: 'https://example.com' });
    });

    it('deve lancar erro se url estiver vazia', async () => {
      await expect(service.create({ url: '' })).rejects.toThrow('URL is required');
    });
  });

  describe('getById', () => {
    it('deve retornar o short pelo id', async () => {
      mockShortenRepository.findOne.mockResolvedValue(mockShort);
      const result = await service.getById('1');
      expect(result).toEqual(mockShort);
      expect(mockShortenRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('deve lancar NotFoundException se nao encontrar', async () => {
      mockShortenRepository.findOne.mockResolvedValue(null);
      await expect(service.getById('99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar o short', async () => {
      mockShortenRepository.update.mockResolvedValue(mockShort);
      const result = await service.update('1', { url: 'https://updated.com' });
      expect(result).toEqual(mockShort);
    });

    it('deve lancar NotFoundException se nao encontrar', async () => {
      mockShortenRepository.update.mockResolvedValue(null);
      await expect(service.update('99', { url: 'https://updated.com' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('deve deletar o short', async () => {
      mockShortenRepository.remove.mockResolvedValue(true);
      await expect(service.delete('1')).resolves.toBeUndefined();
    });

    it('deve lancar NotFoundException se nao encontrar', async () => {
      mockShortenRepository.remove.mockResolvedValue(false);
      await expect(service.delete('99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStatsById', () => {
    it('deve retornar stats do short', async () => {
      mockShortenRepository.findOne.mockResolvedValue(mockShort);
      const result = await service.getStatsById('1');
      expect(result).toEqual(mockShort);
    });

    it('deve lancar NotFoundException se nao encontrar', async () => {
      mockShortenRepository.findOne.mockResolvedValue(null);
      await expect(service.getStatsById('99')).rejects.toThrow(NotFoundException);
    });
  });
});
