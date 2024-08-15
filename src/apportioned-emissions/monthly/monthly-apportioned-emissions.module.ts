import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StreamingModule } from './../../streaming/streaming.module';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsController } from './monthly-apportioned-emissions.controller';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonthUnitDataRepository]),
    StreamingModule,
  ],
  controllers: [MonthlyApportionedEmissionsController],
  providers: [
    ConfigService,
    MonthUnitDataRepository,
    MonthlyApportionedEmissionsService,
  ],
  exports: [TypeOrmModule],
})
export class MonthlyApportionedEmissionsModule {}
