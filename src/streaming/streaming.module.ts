import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DbModule } from '../db/db.module';
import { StreamingService } from './streaming.service';

@Module({
  imports: [DbModule],
  providers: [ConfigService, StreamingService],
  exports: [DbModule, StreamingService],
})
export class StreamingModule {}
