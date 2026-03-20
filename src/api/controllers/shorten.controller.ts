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
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ShortenService } from '../services/shorten.service';
import {
  Short,
  ShortResponse,
  CreateShortDTO,
  UpdateShortDTO,
} from '../entities/short.entity';

@ApiTags('shorten')
@Controller('shorten')
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new short URL' })
  @ApiBody({ type: CreateShortDTO })
  @ApiResponse({ status: HttpStatus.CREATED, type: ShortResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async createShort(
    @Body() createShortDto: CreateShortDTO,
  ): Promise<ShortResponse> {
    return this.shortenService.create(createShortDto);
  }

  @Get(':shortCode')
  @ApiOperation({ summary: 'Get a short URL by short code' })
  @ApiResponse({ status: HttpStatus.OK, type: ShortResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async getShortByCode(
    @Param('shortCode') shortCode: string,
  ): Promise<ShortResponse> {
    return this.shortenService.getShortByCode(shortCode);
  }

  @Get(':shortCode/stats')
  @ApiOperation({ summary: 'Get stats for a short URL by short code' })
  @ApiResponse({ status: HttpStatus.OK, type: Short })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async getStatsByCode(@Param('shortCode') shortCode: string): Promise<Short> {
    return this.shortenService.getStatsByCode(shortCode);
  }

  @Put(':shortCode')
  @ApiOperation({ summary: 'Update a short URL by short code' })
  @ApiBody({ type: UpdateShortDTO })
  @ApiResponse({ status: HttpStatus.OK, type: ShortResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async updateShort(
    @Param('shortCode') shortCode: string,
    @Body() updateShortDto: UpdateShortDTO,
  ): Promise<ShortResponse> {
    return this.shortenService.update(shortCode, updateShortDto);
  }

  @Delete(':shortCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a short URL by short code' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async deleteShort(@Param('shortCode') shortCode: string): Promise<void> {
    return this.shortenService.delete(shortCode);
  }
}
