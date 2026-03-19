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

  create(createShortDto: CreateShortDTO): Short {
    if (!createShortDto.url || createShortDto.url.trim() === '') {
      throw new Error('URL is required');
    }
    return this.shortenRepository.create(createShortDto);
  }

  getById(id: string): Short {
    const short = this.shortenRepository.findOne(id);
    if (!short) {
      throw new NotFoundException(`Short url with id ${id} not found`);
    }
    return short;
  }

  update(id: string, updateShortDto: UpdateShortDTO): Short {
    const updatedShort = this.shortenRepository.update(id, updateShortDto);
    if (!updatedShort) {
      throw new NotFoundException(`Short url with id ${id} not found`);
    }
    return updatedShort;
  }

  delete(id: string): Short {
    const deletedShort = this.shortenRepository.remove(id);
    if (!deletedShort) {
      throw new NotFoundException(`Short url with id ${id} not found`);
    }
    return {
      id,
      url: '',
      shortCode: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  getStatsById(id: string): Short {
    const statsShort = this.shortenRepository.findOne(id);
    if (!statsShort) {
      throw new NotFoundException(`Short url with id ${id} not found`);
    }
    return { ...statsShort, accessCount: 0 };
  }
}
