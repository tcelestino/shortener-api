import { Injectable } from '@nestjs/common';
import {
  Short,
  CreateShortDTO,
  UpdateShortDTO,
} from '../entities/short.entity';

@Injectable()
export class ShortenRepository {
  findOne(id: string): Short | undefined {
    return {
      id,
      url: 'url',
      shortCode: 'uuid',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  create(createShortDto: CreateShortDTO): Short {
    return {
      id: 'uuid',
      url: createShortDto.url,
      shortCode: 'uuid',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  update(id: string, updateShortDto: UpdateShortDTO): Short | undefined {
    return {
      id,
      url: updateShortDto.url,
      shortCode: 'uuid',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  remove(id: string): boolean | undefined {
    console.log(id);
    return true;
  }
}
