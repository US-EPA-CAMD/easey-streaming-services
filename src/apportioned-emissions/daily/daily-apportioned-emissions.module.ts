import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StreamingModule } from './../../streaming/streaming.module';
import { StreamingService } from './../../streaming/streaming.service';
import { DailyApportionedEmissionsController } from './daily-apportioned-emissions.controller';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { DayUnitDataRepository } from './day-unit-data.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DayUnitDataRepository]), StreamingModule],
  controllers: [DailyApportionedEmissionsController],
  providers: [
    ConfigService,
    StreamingService,
    DailyApportionedEmissionsService,
    DayUnitDataRepository,
  ],
  exports: [TypeOrmModule],
})
export class DailyApportionedEmissionsModule {}
