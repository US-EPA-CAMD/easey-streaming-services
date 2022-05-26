import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { StreamingModule } from '../streaming/streaming.module';
import { StreamingService } from '../streaming/streaming.service';
import { AccountComplianceDimRepository } from './account-compliance-dim.repository';

import { AllowanceComplianceController } from './allowance-compliance.controller';
import { AllowanceComplianceService } from './allowance-compliance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountComplianceDimRepository]),
    LoggerModule,
    StreamingModule,
  ],
  controllers: [AllowanceComplianceController],
  providers: [StreamingService, AllowanceComplianceService],
})
export class AllowanceComplianceModule {}
