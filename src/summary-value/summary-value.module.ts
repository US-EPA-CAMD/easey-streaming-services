import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StreamingModule } from '../streaming/streaming.module';
import { SummaryValueController } from './summary-value.controller';
import { SummaryValueRepository } from './summary-value.repository';
import { SummaryValueService } from './summary-value.service';

@Module({
  imports: [
    StreamingModule,
    TypeOrmModule.forFeature([SummaryValueRepository]),
  ],
  controllers: [SummaryValueController],
  providers: [SummaryValueRepository, SummaryValueService],
  exports: [TypeOrmModule, SummaryValueService],
})
export class SummaryValueModule {}
