import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StreamingModule } from '../streaming/streaming.module';
import { HourlyOperatingController } from './hourly-operating.controller';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingService } from './hourly-operating.service';

@Module({
  imports: [
    StreamingModule,
    TypeOrmModule.forFeature([HourlyOperatingRepository]),
  ],
  controllers: [HourlyOperatingController],
  providers: [HourlyOperatingRepository, HourlyOperatingService],
  exports: [TypeOrmModule, HourlyOperatingService],
})
export class HourlyOperatingModule {}
