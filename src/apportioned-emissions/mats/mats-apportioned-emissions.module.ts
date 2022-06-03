import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { HourlyMatsApportionedEmissionsModule } from './hourly/hourly-mats-apportioned-emissions.module';
import { HourUnitMatsDataRepository } from './hourly/hour-unit-mats-data.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourUnitMatsDataRepository]),
    HourlyMatsApportionedEmissionsModule,
    HttpModule,
  ],
  controllers: [],
  providers: [ConfigService],
  exports: [TypeOrmModule],
})
export class MatsApportionedEmissionsModule {}
