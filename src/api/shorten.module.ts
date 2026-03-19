import { Module } from '@nestjs/common';
import { ShortenController } from './controllers/shorten.controller';
import { ShortenService } from './services/shorten.service';
import { ShortenRepository } from './repositories/shorten.repository';

@Module({
  controllers: [ShortenController],
  providers: [ShortenService, ShortenRepository],
  exports: [ShortenService],
})
export class ShortenModule {}
