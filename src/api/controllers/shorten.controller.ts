import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ShortenService } from '../services/shorten.service';
import {
  Short,
  CreateShortDTO,
  UpdateShortDTO,
} from '../entities/short.entity';

@Controller('shorten')
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createShort(@Body() createShortDto: CreateShortDTO): Short {
    return this.shortenService.create(createShortDto);
  }

  @Get(':id')
  getShortById(@Param('id') id: string): Short {
    return this.shortenService.getById(id);
  }

  @Put(':id')
  updateShort(
    @Param('id') id: string,
    @Body() updateShortDto: UpdateShortDTO,
  ): Short {
    return this.shortenService.update(id, updateShortDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteShort(@Param('id') id: string): void {
    this.shortenService.delete(id);
  }

  @Get(':id/stats')
  getStatsById(@Param('id') id: string): Short {
    return this.shortenService.getStatsById(id);
  }
}
