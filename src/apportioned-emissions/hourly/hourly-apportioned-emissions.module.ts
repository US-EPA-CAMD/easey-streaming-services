import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StreamingService } from './../../streaming/streaming.service';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsController } from './hourly-apportioned-emissions.controller';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([HourUnitDataRepository])],
  controllers: [HourlyApportionedEmissionsController],
  providers: [
    ConfigService,
    StreamingService,
    HourUnitDataRepository,
    HourlyApportionedEmissionsService,
  ],
  exports: [TypeOrmModule],
})
export class HourlyApportionedEmissionsModule {}
