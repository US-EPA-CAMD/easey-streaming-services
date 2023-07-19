import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplementalOperatingRepository } from './supplemental-operating.repository';
import { SupplementalOperatingService } from './supplemental-operating.service';
import { SupplementalOperatingController } from './supplemental-operating.controller';
import { StreamingModule } from '../streaming/streaming.module';

@Module({
  imports: [
    StreamingModule,
    TypeOrmModule.forFeature([SupplementalOperatingRepository]),
  ],
  controllers: [SupplementalOperatingController],
  providers: [SupplementalOperatingService],
  exports: [TypeOrmModule, SupplementalOperatingService],
})
export class SupplementalOperatingModule {}
