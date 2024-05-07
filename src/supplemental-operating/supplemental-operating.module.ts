import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StreamingModule } from '../streaming/streaming.module';
import { SupplementalOperatingController } from './supplemental-operating.controller';
import { SupplementalOperatingRepository } from './supplemental-operating.repository';
import { SupplementalOperatingService } from './supplemental-operating.service';

@Module({
  imports: [
    StreamingModule,
    TypeOrmModule.forFeature([SupplementalOperatingRepository]),
  ],
  controllers: [SupplementalOperatingController],
  providers: [SupplementalOperatingRepository, SupplementalOperatingService],
  exports: [TypeOrmModule, SupplementalOperatingService],
})
export class SupplementalOperatingModule {}
