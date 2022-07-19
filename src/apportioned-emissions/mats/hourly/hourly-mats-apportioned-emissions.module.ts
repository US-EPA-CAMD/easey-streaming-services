import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';
import { HourlyMatsApportionedEmissionsService } from './hourly-mats-apportioned-emissions.service';
import { HourlyMatsApportionedEmissionsController } from './hourly-mats-apportioned-emissions.controller';
import { StreamingService } from '../../../streaming/streaming.service';

@Module({
  imports: [TypeOrmModule.forFeature([HourUnitMatsDataRepository])],
  controllers: [HourlyMatsApportionedEmissionsController],
  providers: [
    ConfigService,
    StreamingService,
    HourlyMatsApportionedEmissionsService,
  ],
  exports: [TypeOrmModule],
})
export class HourlyMatsApportionedEmissionsModule {}
