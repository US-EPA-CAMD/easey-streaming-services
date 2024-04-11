import { Injectable, StreamableFile } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Transform } from 'stream';
import { v4 as uuid } from 'uuid';

import { SummaryValueBaseDTO } from '../dto/summary-value.dto';
import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';
import { StreamingService } from '../streaming/streaming.service';
import { SummaryValueRepository } from './summary-value.repository';

@Injectable()
export class SummaryValueService {
  constructor(
    private readonly repository: SummaryValueRepository,
    private readonly streamingService: StreamingService,
  ) {}

  async streamSummaryValues(
    req: Request,
    params: OrisQuarterParamsDto,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="summary-values-${uuid()}`;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        const dto = plainToClass(SummaryValueBaseDTO, data, {
          enableImplicitConversion: true,
        });
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
      [],
    );
  }
}
