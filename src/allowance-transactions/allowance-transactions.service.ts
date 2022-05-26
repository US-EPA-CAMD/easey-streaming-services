import { Injectable, StreamableFile } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { exclude } from '@us-epa-camd/easey-common/utilities';
import { ExcludeAllowanceTransactions } from '@us-epa-camd/easey-common/enums';

import { TransactionBlockDimRepository } from './transaction-block-dim.repository';
import { StreamAllowanceTransactionsParamsDTO } from '../dto/allowance-transactions.params.dto';
import { StreamingService } from '../streaming/streaming.service';
import { AllowanceTransactionsDTO } from '../dto/allowance-transactions.dto';
import { fieldMappings } from '../constants/account-field-mappings';

@Injectable()
export class AllowanceTransactionsService {
  constructor(
    @InjectRepository(TransactionBlockDimRepository)
    private readonly repository: TransactionBlockDimRepository,
    private readonly logger: Logger,
    private readonly streamingService: StreamingService,
  ) {}

  async streamAllowanceTransactions(
    req: Request,
    params: StreamAllowanceTransactionsParamsDTO,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="allowance-compliance-${uuid()}`;

    let fieldMappingValues = [];
    fieldMappingValues = fieldMappings.allowances.transactions.data;
    const fieldMappingsList = params.exclude
      ? fieldMappingValues.filter(item => !params.exclude.includes(item.value))
      : fieldMappings.allowances.transactions.data;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        data = exclude(data, params, ExcludeAllowanceTransactions);
        delete data.transactionBlockId;
        const dto = plainToClass(AllowanceTransactionsDTO, data, {
          enableImplicitConversion: true,
        });
        const transactionDate = new Date(dto.transactionDate);
        dto.transactionDate = transactionDate.toISOString().split('T')[0];
        callback(null, dto);
      },
    });

    const [sql, values] = await this.repository.buildQuery(params);

    return this.streamingService.getStream(
      req,
      sql,
      values,
      json2Dto,
      disposition,
      fieldMappingsList,
    );
  }
}
