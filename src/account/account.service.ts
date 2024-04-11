import { Injectable, StreamableFile } from '@nestjs/common';
import { ExcludeAccountAttributes } from '@us-epa-camd/easey-common/enums';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Transform } from 'stream';
import { v4 as uuid } from 'uuid';

import { fieldMappings } from '../constants/account-field-mappings';
import { AccountAttributesDTO } from '../dto/account-attributes.dto';
import { StreamAccountAttributesParamsDTO } from '../dto/account-attributes.params.dto';
import { StreamingService } from '../streaming/streaming.service';
import { AccountFactRepository } from './account-fact.repository';

@Injectable()
export class AccountService {
  constructor(
    private readonly repository: AccountFactRepository,
    private readonly logger: Logger,
    private readonly streamService: StreamingService,
  ) {}
  async streamAllAccountAttributes(
    req: Request,
    params: StreamAccountAttributesParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="account-attributes-${uuid()}`;

    let fieldMappingValues = [];
    fieldMappingValues = fieldMappings.allowances.accountAttributes.data;
    const fieldMappingsList = params.exclude
      ? fieldMappingValues.filter(item => !params.exclude.includes(item.value))
      : fieldMappings.allowances.accountAttributes.data;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeAccountAttributes);
        const dto = plainToClass(AccountAttributesDTO, data, {
          enableImplicitConversion: true,
        });
        callback(null, dto);
      },
    });

    const [sql, values] = await this.repository.buildQuery(params);

    return this.streamService.getStream(
      req,
      sql,
      values,
      json2Dto,
      disposition,
      fieldMappingsList,
    );
  }
}
