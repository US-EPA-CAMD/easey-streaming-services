import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingService } from './hourly-operating.service';
import { HourlyOperatingController } from './hourly-operating.controller';
import { StreamingModule } from '../streaming/streaming.module';

@Module({
  imports: [
    StreamingModule,
    TypeOrmModule.forFeature([HourlyOperatingRepository]),
  ],
  controllers: [HourlyOperatingController],
  providers: [HourlyOperatingService],
  exports: [TypeOrmModule, HourlyOperatingService],
})
export class HourlyOperatingModule {}
