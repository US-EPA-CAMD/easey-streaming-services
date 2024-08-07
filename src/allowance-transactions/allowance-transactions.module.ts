import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { StreamingModule } from '../streaming/streaming.module';
import { StreamingService } from '../streaming/streaming.service';
import AllowanceTransactionsController from './allowance-transactions.controller';
import { AllowanceTransactionsService } from './allowance-transactions.service';
import { TransactionBlockDimRepository } from './transaction-block-dim.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionBlockDimRepository]),
    LoggerModule,
    StreamingModule,
  ],
  controllers: [AllowanceTransactionsController],
  providers: [
    StreamingService,
    AllowanceTransactionsService,
    TransactionBlockDimRepository,
  ],
})
export class AllowanceTransactionsModule {}
