import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { StreamingModule } from '../streaming/streaming.module';
import { StreamingService } from '../streaming/streaming.service';
import { AllowanceHoldingDimRepository } from './allowance-holding-dim.repository';
import { AllowanceHoldingsController } from './allowance-holdings.controller';
import { AllowanceHoldingsService } from './allowance-holdings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AllowanceHoldingDimRepository]),
    LoggerModule,
    StreamingModule,
  ],
  controllers: [AllowanceHoldingsController],
  providers: [
    AllowanceHoldingDimRepository,
    AllowanceHoldingsService,
    StreamingService,
  ],
})
export class AllowanceHoldingsModule {}
