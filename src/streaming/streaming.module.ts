import { Module } from '@nestjs/common';

import { StreamingService } from './streaming.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [],
  providers: [ConfigService, StreamingService],
  exports: [StreamingService],
})
export class StreamingModule {}
