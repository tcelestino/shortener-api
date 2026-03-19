import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShortenModule } from './api/shorten.module';

@Module({
  imports: [ShortenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
