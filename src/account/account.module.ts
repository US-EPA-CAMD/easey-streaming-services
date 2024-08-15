import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { StreamingModule } from '../streaming/streaming.module';
import { StreamingService } from './../streaming/streaming.service';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountFactRepository } from './account-fact.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountFactRepository]),
    LoggerModule,
    StreamingModule,
  ],
  controllers: [AccountController],
  providers: [StreamingService, AccountFactRepository, AccountService],
})
export class AccountModule {}
