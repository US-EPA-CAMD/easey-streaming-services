import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StreamingModule } from './../../streaming/streaming.module';
import { OzoneApportionedEmissionsController } from './ozone-apportioned-emissions.controller';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OzoneUnitDataRepository]),
    StreamingModule,
  ],
  controllers: [OzoneApportionedEmissionsController],
  providers: [
    ConfigService,
    OzoneUnitDataRepository,
    OzoneApportionedEmissionsService,
  ],
  exports: [TypeOrmModule],
})
export class OzoneApportionedEmissionsModule {}
