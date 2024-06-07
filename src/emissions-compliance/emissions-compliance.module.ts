import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { StreamingModule } from '../streaming/streaming.module';
import { StreamingService } from '../streaming/streaming.service';
import EmissionsComplianceController from './emissions-compliance.controller';
import EmissionsComplianceService from './emissions-compliance.service';
import { UnitComplianceDimRepository } from './unit-compliance-dim.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitComplianceDimRepository]),
    LoggerModule,
    StreamingModule,
  ],
  controllers: [EmissionsComplianceController],
  providers: [
    StreamingService,
    EmissionsComplianceService,
    UnitComplianceDimRepository,
  ],
})
export class EmissionsComplianceModule {}
