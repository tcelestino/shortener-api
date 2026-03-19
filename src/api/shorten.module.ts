import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database.module';
import { ShortenController } from './controllers/shorten.controller';
import { ShortenService } from './services/shorten.service';
import { ShortenRepository } from './repositories/shorten.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ShortenController],
  providers: [ShortenService, ShortenRepository],
  exports: [ShortenService],
})
export class ShortenModule {}
