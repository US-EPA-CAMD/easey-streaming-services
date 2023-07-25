import { Injectable, StreamableFile } from '@nestjs/common';
import { SummaryValueBaseDTO } from '../dto/summary-value.dto';
import { OrisQuarterParamsDto } from '../dto/summary-value.params.dto';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { SummaryValueRepository } from './summary-value.repository';
import { StreamingService } from '../streaming/streaming.service';

@Injectable()
export class SummaryValueService {
  constructor(
    @InjectRepository(SummaryValueRepository)
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
          enableImplicitConversion: false,
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
