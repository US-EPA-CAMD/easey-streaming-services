import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AllowanceHoldingsController } from './allowance-holdings.controller';
import { AllowanceHoldingsService } from './allowance-holdings.service';
import { AllowanceHoldingDimRepository } from './allowance-holding-dim.repository';
import { StreamingService } from '../streaming/streaming.service';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { StreamingModule } from 'src/streaming/streaming.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AllowanceHoldingDimRepository]),
    LoggerModule,
    StreamingModule,
  ],
  controllers: [AllowanceHoldingsController],
  providers: [AllowanceHoldingsService, StreamingService],
})
export class AllowanceHoldingsModule {}
