import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DerivedHourlyRepository } from './derived-hourly.repository';
import { DerivedHourlyService } from './derived-hourly.service';
import { DerivedHourlyController } from './derived-hourly.controller';
import { StreamingModule } from '../streaming/streaming.module';

@Module({
  imports: [
    StreamingModule,
    TypeOrmModule.forFeature([DerivedHourlyRepository]),
  ],
  controllers: [DerivedHourlyController],
  providers: [DerivedHourlyService],
  exports: [TypeOrmModule, DerivedHourlyService],
})
export class DerivedHourlyModule {}
