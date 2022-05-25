import { Request } from 'express';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';

import { Injectable, StreamableFile } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { exclude } from '@us-epa-camd/easey-common/utilities';

import { StreamingService } from '../streaming/streaming.service';
import { StreamAccountAttributesParamsDTO } from '../dto/account-attributes.params.dto';
import { fieldMappings } from '../constants/account-field-mappings';
import { AccountFactRepository } from './account-fact.repository';
import { ExcludeAccountAttributes } from '@us-epa-camd/easey-common/enums';
import { AccountAttributesDTO } from '../dto/account-attributes.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountFactRepository)
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

    const [sql, values] = await this.repository.buildQuery(
      fieldMappingsList,
      params,
    );

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
