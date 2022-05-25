import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { StreamingModule } from '../streaming/streaming.module';
import { StreamingService } from './../streaming/streaming.service';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([

    ]),
    LoggerModule,
    StreamingModule,
  ],
  controllers: [
    AccountController
  ],
  providers: [
    StreamingService,
    AccountService,
  ],
})
export class AccountModule {}