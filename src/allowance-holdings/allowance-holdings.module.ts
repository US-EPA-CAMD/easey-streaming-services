import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AllowanceHoldingsController } from './allowance-holdings.controller';
import { AllowanceHoldingsService } from './allowance-holdings.service';
import { AllowanceHoldingDimRepository } from './allowance-holding-dim.repository';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { StreamModule } from '@us-epa-camd/easey-common/stream';
import { StreamingService } from '../streaming/streaming.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AllowanceHoldingDimRepository]),
    HttpModule,
    StreamModule,
  ],
  controllers: [AllowanceHoldingsController],
  providers: [AllowanceHoldingsService, ConfigService, StreamingService],
})
export class AllowanceHoldingsModule {}
