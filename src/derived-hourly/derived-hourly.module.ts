import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StreamingModule } from '../streaming/streaming.module';
import { DerivedHourlyController } from './derived-hourly.controller';
import { DerivedHourlyRepository } from './derived-hourly.repository';
import { DerivedHourlyService } from './derived-hourly.service';

@Module({
  imports: [
    StreamingModule,
    TypeOrmModule.forFeature([DerivedHourlyRepository]),
  ],
  controllers: [DerivedHourlyController],
  providers: [DerivedHourlyService],
  exports: [TypeOrmModule, DerivedHourlyRepository, DerivedHourlyService],
})
export class DerivedHourlyModule {}
