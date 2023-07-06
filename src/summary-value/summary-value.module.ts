import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummaryValueRepository } from './summary-value.repository';
import { SummaryValueService } from './summary-value.service';
import { SummaryValueController } from './summary-value.controller';
import { StreamingModule } from '../streaming/streaming.module';

@Module({
  imports: [
    StreamingModule,
    TypeOrmModule.forFeature([SummaryValueRepository]),
  ],
  controllers: [SummaryValueController],
  providers: [SummaryValueService],
  exports: [TypeOrmModule, SummaryValueService],
})
export class SummaryValueModule {}
