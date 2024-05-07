import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StreamingModule } from './../../streaming/streaming.module';
import { StreamingService } from './../../streaming/streaming.service';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsController } from './quarterly-apportioned-emissions.controller';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuarterUnitDataRepository]),
    StreamingModule,
  ],
  controllers: [QuarterlyApportionedEmissionsController],
  providers: [
    ConfigService,
    StreamingService,
    QuarterUnitDataRepository,
    QuarterlyApportionedEmissionsService,
  ],
  exports: [TypeOrmModule],
})
export class QuarterlyApportionedEmissionsModule {}
