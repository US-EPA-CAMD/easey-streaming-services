import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { ExcludeAllowanceHoldings } from '@us-epa-camd/easey-common/enums';

import { AllowanceHoldingsDTO } from '../dto/allowance-holdings.dto';
import { StreamAllowanceHoldingsParamsDTO } from '../dto/allowance-holdings.params.dto';
import { AllowanceHoldingDimRepository } from './allowance-holding-dim.repository';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { StreamingService } from '../streaming/streaming.service';
import { fieldMappings } from '../constants/account-field-mappings';

@Injectable()
export class AllowanceHoldingsService {
  constructor(
    @InjectRepository(AllowanceHoldingDimRepository)
    private readonly allowanceHoldingsRepository: AllowanceHoldingDimRepository,
    private readonly logger: Logger,
    private readonly streamService: StreamingService,
  ) {}

  async streamAllowanceHoldings(
    req: Request,
    params: StreamAllowanceHoldingsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="allowance-holdings-${uuid()}`;

    let fieldMappingValues = [];
    fieldMappingValues = fieldMappings.allowances.holdings.data;
    const fieldMappingsList = params.exclude
      ? fieldMappingValues.filter(item => !params.exclude.includes(item.value))
      : fieldMappings.allowances.holdings.data;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeAllowanceHoldings);
        const dto = plainToClass(AllowanceHoldingsDTO, data, {
          enableImplicitConversion: true,
        });
        callback(null, dto);
      },
    });

    const [sql, values] = await this.allowanceHoldingsRepository.buildQuery(
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
