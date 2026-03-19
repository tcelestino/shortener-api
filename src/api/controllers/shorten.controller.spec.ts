import { Test, TestingModule } from '@nestjs/testing';
import { ShortenController } from './shorten.controller';
import { ShortenService } from '../services/shorten.service';
import { NotFoundException } from '@nestjs/common';

describe('ShortenController', () => {
  let controller: ShortenController;
  let service: ShortenService;

  const mockShortData = {
    id: '1',
    url: 'https://strange-kiss.net',
    shortCode: 'abc123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenController],
      providers: [
        {
          provide: ShortenService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getById: jest.fn(),
            getStatsById: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<ShortenController>(ShortenController);
    service = module.get<ShortenService>(ShortenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('createShort', () => {
    const url = mockShortData.url;
    it('should create a short url with success', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockShortData);

      const result = await controller.createShort({ url });

      expect(result).toEqual(mockShortData);
      expect(service.create).toHaveBeenCalledWith({ url });
    });

    it('should throw an error when create is fail', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error('Error'));

      expect(controller.createShort({ url })).rejects.toThrow('Error');
    });
  });

  describe('getShortById', () => {
    const shortCode = mockShortData.shortCode;
    it('should return a short', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockShortData);

      const result = await controller.getShortById(shortCode);

      expect(result).toEqual(mockShortData);
      expect(service.getById).toHaveBeenCalledWith(shortCode);
    });

    it('should throw an error when short is not found', async () => {
      jest
        .spyOn(service, 'getById')
        .mockRejectedValue(
          new NotFoundException(
            `Short url with shortCode ${shortCode} not found`,
          ),
        );

      expect(controller.getShortById(shortCode)).rejects.toThrow(
        'Short url with shortCode abc123 not found',
      );
    });

    it('should throw an error when create is fail', async () => {
      jest.spyOn(service, 'getById').mockRejectedValue(new Error('Error'));

      expect(controller.getShortById(shortCode)).rejects.toThrow('Error');
    });
  });

  describe('getStatsById', () => {
    const shortCode = mockShortData.shortCode;
    const mockShortStatsData = {
      ...mockShortData,
      accessCount: 0,
    };
    it('should return a short with accessCount', async () => {
      jest.spyOn(service, 'getStatsById').mockResolvedValue(mockShortStatsData);

      const result = await controller.getStatsById(shortCode);

      expect(result).toEqual(mockShortStatsData);
      expect(service.getStatsById).toHaveBeenCalledWith(shortCode);
    });

    it('should throw an error when short is not found', async () => {
      jest
        .spyOn(service, 'getStatsById')
        .mockRejectedValue(
          new NotFoundException(
            `Short url with shortCode ${shortCode} not found`,
          ),
        );

      expect(controller.getStatsById(shortCode)).rejects.toThrow(
        'Short url with shortCode abc123 not found',
      );
    });

    it('should throw an error when create is fail', async () => {
      jest.spyOn(service, 'getStatsById').mockRejectedValue(new Error('Error'));

      expect(controller.getStatsById(shortCode)).rejects.toThrow('Error');
    });
  });

  describe('updateShort', () => {
    const shortCode = mockShortData.shortCode;
    const updateAtDate = new Date();
    const mockShortUpdatedData = {
      ...mockShortData,
      updateAtDate,
      url: 'http://new-url.com',
    };

    it('should update a short', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(mockShortUpdatedData);

      const result = await controller.updateShort(mockShortData.shortCode, {
        url: 'http://new-url.com',
      });

      expect(result).toEqual(mockShortUpdatedData);
      expect(service.update).toHaveBeenCalledWith(mockShortData.shortCode, {
        url: 'http://new-url.com',
      });
    });

    it('should throw an error when short is not found', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new NotFoundException(
            `Short url with shortCode ${shortCode} not found`,
          ),
        );

      expect(
        controller.updateShort(mockShortData.shortCode, {
          url: 'http://new-url',
        }),
      ).rejects.toThrow('Short url with shortCode abc123 not found');
    });

    it('should throw an error when create is fail', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new Error('Error'));

      expect(
        controller.updateShort(mockShortData.shortCode, {
          url: 'http://new-url.com',
        }),
      ).rejects.toThrow('Error');
    });
  });

  describe('deleteShort', () => {
    const shortCode = mockShortData.shortCode;

    it('should delete a short', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue();

      await controller.deleteShort(mockShortData.shortCode);

      expect(service.delete).toHaveBeenCalledWith(mockShortData.shortCode);
    });

    it('should throw an error when short is not found', async () => {
      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(
          new NotFoundException(
            `Short url with shortCode ${shortCode} not found`,
          ),
        );

      expect(controller.deleteShort(mockShortData.shortCode)).rejects.toThrow(
        'Short url with shortCode abc123 not found',
      );
    });

    it('should throw an error when create is fail', async () => {
      jest.spyOn(service, 'delete').mockRejectedValue(new Error('Error'));

      expect(controller.deleteShort(mockShortData.shortCode)).rejects.toThrow(
        'Error',
      );
    });
  });
});
