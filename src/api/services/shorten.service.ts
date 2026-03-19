import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Short,
  ShortResponse,
  CreateShortDTO,
  UpdateShortDTO,
} from '../entities/short.entity';
import { ShortenRepository } from '../repositories/shorten.repository';

@Injectable()
export class ShortenService {
  constructor(private readonly shortenRepository: ShortenRepository) {}

  async create(createShortDto: CreateShortDTO): Promise<ShortResponse> {
    const { accessCount: _, ...result } =
      await this.shortenRepository.create(createShortDto);
    return result;
  }

  async getById(shortCode: string): Promise<ShortResponse> {
    const short =
      await this.shortenRepository.findOneAndIncrementAccess(shortCode);
    if (!short) {
      throw new NotFoundException(
        `Short url with shortCode ${shortCode} not found`,
      );
    }
    const { accessCount: _, ...result } = short;
    return result;
  }

  async update(
    shortCode: string,
    updateShortDto: UpdateShortDTO,
  ): Promise<ShortResponse> {
    const updatedShort = await this.shortenRepository.update(
      shortCode,
      updateShortDto,
    );
    if (!updatedShort) {
      throw new NotFoundException(
        `Short url with shortCode ${shortCode} not found`,
      );
    }
    const { accessCount: _, ...result } = updatedShort;
    return result;
  }

  async delete(shortCode: string): Promise<void> {
    const deleted = await this.shortenRepository.remove(shortCode);
    if (!deleted) {
      throw new NotFoundException(
        `Short url with shortCode ${shortCode} not found`,
      );
    }
  }

  async getStatsById(shortCode: string): Promise<Short> {
    const statsShort = await this.shortenRepository.findOne(shortCode);
    if (!statsShort) {
      throw new NotFoundException(
        `Short url with shortCode ${shortCode} not found`,
      );
    }
    return statsShort;
  }
}
