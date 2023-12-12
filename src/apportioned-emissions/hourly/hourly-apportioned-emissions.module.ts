import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { StreamingModule } from './../../streaming/streaming.module';
import { StreamingService } from './../../streaming/streaming.service';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourlyApportionedEmissionsController } from './hourly-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourUnitDataRepository]),
    StreamingModule,
  ],
  controllers: [HourlyApportionedEmissionsController],
  providers: [
    ConfigService,
    StreamingService,
    HourlyApportionedEmissionsService],
  exports: [TypeOrmModule],
})
export class HourlyApportionedEmissionsModule {}
