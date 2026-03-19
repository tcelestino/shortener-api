import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Short,
  CreateShortDTO,
  UpdateShortDTO,
} from '../entities/short.entity';
import { ShortenRepository } from '../repositories/shorten.repository';

@Injectable()
export class ShortenService {
  constructor(private readonly shortenRepository: ShortenRepository) {}

  async create(createShortDto: CreateShortDTO): Promise<Short> {
    if (!createShortDto.url || createShortDto.url.trim() === '') {
      throw new Error('URL is required');
    }
    return this.shortenRepository.create(createShortDto);
  }

  async getById(id: string): Promise<Short> {
    const short = await this.shortenRepository.findOne(id);
    if (!short) {
      throw new NotFoundException(`Short url with id ${id} not found`);
    }
    return short;
  }

  async update(id: string, updateShortDto: UpdateShortDTO): Promise<Short> {
    const updatedShort = await this.shortenRepository.update(id, updateShortDto);
    if (!updatedShort) {
      throw new NotFoundException(`Short url with id ${id} not found`);
    }
    return updatedShort;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.shortenRepository.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Short url with id ${id} not found`);
    }
  }

  async getStatsById(id: string): Promise<Short> {
    const statsShort = await this.shortenRepository.findOne(id);
    if (!statsShort) {
      throw new NotFoundException(`Short url with id ${id} not found`);
    }
    return statsShort;
  }
}
