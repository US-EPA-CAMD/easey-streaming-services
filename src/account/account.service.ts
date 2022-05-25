import { Request } from 'express';
import { v4 as uuid } from 'uuid';

import {
  Injectable,
  StreamableFile,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { StreamingService } from '../streaming/streaming.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly logger: Logger,
    private readonly streamingService: StreamingService,
  ) {}

  async streamAccountAttributes(
    req: Request,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="account-attributes-${uuid()}`;

    return;
  }
}

export default AccountService;