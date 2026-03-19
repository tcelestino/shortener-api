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
  async createShort(@Body() createShortDto: CreateShortDTO): Promise<Short> {
    return this.shortenService.create(createShortDto);
  }

  @Get(':id')
  async getShortById(@Param('id') id: string): Promise<Short> {
    return this.shortenService.getById(id);
  }

  @Put(':id')
  async updateShort(
    @Param('id') id: string,
    @Body() updateShortDto: UpdateShortDTO,
  ): Promise<Short> {
    return this.shortenService.update(id, updateShortDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteShort(@Param('id') id: string): Promise<void> {
    return this.shortenService.delete(id);
  }

  @Get(':id/stats')
  async getStatsById(@Param('id') id: string): Promise<Short> {
    return this.shortenService.getStatsById(id);
  }
}
