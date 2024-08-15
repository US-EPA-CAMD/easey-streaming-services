import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StreamingModule } from './../../../streaming/streaming.module';
import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';
import { HourlyMatsApportionedEmissionsController } from './hourly-mats-apportioned-emissions.controller';
import { HourlyMatsApportionedEmissionsService } from './hourly-mats-apportioned-emissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourUnitMatsDataRepository]),
    StreamingModule,
  ],
  controllers: [HourlyMatsApportionedEmissionsController],
  providers: [
    ConfigService,
    HourUnitMatsDataRepository,
    HourlyMatsApportionedEmissionsService,
  ],
  exports: [TypeOrmModule],
})
export class HourlyMatsApportionedEmissionsModule {}
