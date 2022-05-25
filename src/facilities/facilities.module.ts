import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { StreamingModule } from '../streaming/streaming.module';
import { StreamingService } from '../streaming/streaming.service';

import { FacilitiesController } from './facilities.controller';
import { FacilitiesService } from './facilities.service';
import { FacilityUnitAttributesRepository } from './facility-unit-attributes.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FacilityUnitAttributesRepository,
    ]),
    LoggerModule,
    StreamingModule,
  ],
  controllers: [
    FacilitiesController
  ],
  providers: [
    StreamingService,
    FacilitiesService,
  ],
})
export class FacilitiesModule {}