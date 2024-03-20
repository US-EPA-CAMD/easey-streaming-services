import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { StreamingModule } from './../../streaming/streaming.module';
import { StreamingService } from './../../streaming/streaming.service';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { OzoneApportionedEmissionsController } from './ozone-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OzoneUnitDataRepository]),
    StreamingModule
  ],
  controllers: [OzoneApportionedEmissionsController],
  providers: [
    ConfigService,
    StreamingService,
    OzoneApportionedEmissionsService
  ],
  exports: [TypeOrmModule],
})
export class OzoneApportionedEmissionsModule {}
