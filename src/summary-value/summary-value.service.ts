import { Injectable, StreamableFile } from '@nestjs/common';
import { SummaryValueRecordDTO } from '../dto/summary-value.dto';
import { SummaryValueParamsDto } from '../dto/summary-value.params.dto';
import { v4 as uuid } from 'uuid';
import { Transform } from 'stream';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { SummaryValueRepository } from './summary-value.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { StreamingService } from '../streaming/streaming.service';

@Injectable()
export class SummaryValueService {
  constructor(
    @InjectRepository(SummaryValueRepository)
    private readonly repository: SummaryValueRepository,
    private readonly logger: Logger,
    private readonly streamingService: StreamingService,
  ) {}

  async streamSummaryValues(
    req: Request,
    params: SummaryValueParamsDto,
  ): Promise<StreamableFile> {
    const disposition = `attachment; filename="facility-attributes-${uuid()}`;

    const json2Dto = new Transform({
      objectMode: true,
      transform(data, _enc, callback) {
        delete data.id;
        const dto = plainToClass(null, data, {
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
